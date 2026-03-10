import React, { useState, useMemo } from 'react'
import { saveSnapshot } from '../utils/supabase.js'
import { useRosterStore, STATUSES, SHIFTS } from '../store/rosterStore.js'
import { convertTime, TZ_INFO } from '../utils/timezone.js'


const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const Icons = {
  users:    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  check:    'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  calendar: 'M3 9h18M16 2v4M8 2v4M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  leave:    'M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M9 17H7M17 13H7M17 9h-3',
  oncall:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.1 1.11h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z',
  shift:    'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  pdf:      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  link:     'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  copy:     'M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z',
  open:     'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
}

function parseTimeToMins(str) {
  if (!str) return 0
  const [time, ampm] = str.trim().split(' ')
  let [h, m] = time.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function minsToLabel(mins) {
  const norm = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(norm / 60)
  const m = norm % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${m.toString().padStart(2,'0')} ${ampm}`
}

const ALL_SLOTS = Array.from({ length: 48 }, (_, i) => i * 30)

export default function PDFExport({ timezone }) {
  const { engineers, activeWeekId, weeks } = useRosterStore()
  const activeWeek = weeks?.[activeWeekId]
  const days = activeWeek?.days || []
  const schedule = activeWeek?.schedule || {}
  const weekLabel = activeWeek?.weekLabel || ''

  const [exporting, setExporting] = useState(false)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [includeLegend, setIncludeLegend] = useState(true)
  const [shareLink, setShareLink] = useState(null)
  const [copied, setCopied] = useState(false)
  const [savingLink, setSavingLink] = useState(false)
  const [linkIsRemote, setLinkIsRemote] = useState(false)

  const analytics = useMemo(() => {
    let totalWorking = 0, totalLeave = 0, totalWO = 0, totalOnCall = 0
    engineers.forEach(eng => {
      days.forEach(day => {
        const e = schedule[eng.id]?.[day.id]
        if (!e) return
        if (e.status === 'WORKING') totalWorking++
        if (['ANNUAL_LEAVE','SICK_LEAVE','COMP_OFF'].includes(e.status)) totalLeave++
        if (e.status === 'WEEKLY_OFF') totalWO++
        if (e.isOnCall) totalOnCall++
      })
    })
    return { totalWorking, totalLeave, totalWO, totalOnCall }
  }, [engineers, days, schedule])

  const dailyCoverage = useMemo(() => days.map(day => {
    let working = 0, leave = 0, onCall = 0, weeklyOff = 0
    engineers.forEach(eng => {
      const e = schedule[eng.id]?.[day.id]
      if (!e) return
      if (e.status === 'WORKING') working++
      if (['ANNUAL_LEAVE','SICK_LEAVE','COMP_OFF'].includes(e.status)) leave++
      if (e.status === 'WEEKLY_OFF') weeklyOff++
      if (e.isOnCall) onCall++
    })
    return { day, working, leave, onCall, weeklyOff }
  }), [engineers, days, schedule])

  const shiftDist = useMemo(() => {
    const dist = {}
    Object.keys(SHIFTS).forEach(s => dist[s] = [])
    engineers.forEach(eng => {
      const workingDays = days.filter(d => schedule[eng.id]?.[d.id]?.status === 'WORKING')
      if (workingDays.length > 0) {
        const shift = schedule[eng.id]?.[workingDays[0].id]?.shift || eng.shift
        if (dist[shift]) dist[shift].push(eng.name)
      }
    })
    return dist
  }, [engineers, days, schedule])

  const leaveReport = useMemo(() => {
    const rows = []
    engineers.forEach(eng => {
      days.forEach(day => {
        const e = schedule[eng.id]?.[day.id]
        if (e && ['ANNUAL_LEAVE','SICK_LEAVE','COMP_OFF','PUBLIC_HOL'].includes(e.status))
          rows.push({ eng, day, status: e.status })
      })
    })
    return rows
  }, [engineers, days, schedule])

  const onCallCoverage = useMemo(() => {
    const rows = []
    days.forEach(day => {
      const ocEngs = engineers.filter(eng => schedule[eng.id]?.[day.id]?.isOnCall)
      if (ocEngs.length > 0) rows.push({ day, engineers: ocEngs })
    })
    return rows
  }, [engineers, days, schedule])

  const summary = useMemo(() => engineers.map(eng => {
    const counts = {}
    Object.keys(STATUSES).forEach(s => counts[s] = 0)
    let onCallDays = 0
    days.forEach(day => {
      const e = schedule[eng.id]?.[day.id]
      if (e) { counts[e.status] = (counts[e.status] || 0) + 1; if (e.isOnCall) onCallDays++ }
    })
    return { eng, counts, onCallDays }
  }), [engineers, days, schedule])

  async function handleExport() {
    setExporting(true)
    try {
      const { jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default

      // ─── PAGE SETUP ──────────────────────────────────────────────────────
      // Reference: 792 × 612 pts, US Letter landscape
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [792, 612] })
      const PW = 792

      // ─── COLORS ──────────────────────────────────────────────────────────
      const BLACK  = [0,   0,   0  ]
      const GREEN  = [0,   128, 0  ]   // shift start
      const RED    = [192, 0,   0  ]   // leave
      const PINK   = [220, 0,   120]   // comp off
      const PURPLE = [128, 0,   128]   // public holiday
      const DKBLUE = [0,   0,   180]   // weekly off / IST text
      const TEAL   = [0,   96,  96 ]   // EST text
      const PLUM   = [75,  0,   130]   // PST text
      const LGRAY  = [200, 200, 200]

      // ─── TIMEZONE OFFSETS ────────────────────────────────────────────────
      // IST is UTC+5:30. EST = IST − 10h30m = −630 min. PST = IST − 13h30m = −810 min
      const EST_OFF = 630
      const PST_OFF = 810

      // ─── COLUMN WIDTHS — measured pixel-perfectly from reference PDF ─────
      // Left margin = 50. Content ends at x=742. Right margin = 50.
      const M = 50   // margin

      // Left TZ block: EST | EST Date | PST | PST Date | IST  (total 58 pts)
      const EL=13, EDL=13, PL=11, PDL=11, IL=10

      // Day area: x=108 to x=676  →  568 pts / 7 days = 81.14 / day
      const DAY_X   = M + EL+EDL+PL+PDL+IL   // 108
      const DAY_END = 676
      const DAY_AREA= DAY_END - DAY_X          // 568
      const DAY_W   = DAY_AREA / 7             // 81.14 per day
      const ENG_W   = DAY_W / 8               // 10.14 per engineer slot

      // Right TZ block: IST | PST | PST Date | EST | EST Date  (total 66 pts)
      const IR=14, PR=10, PDR=14, ER=11, EDR=17

      // ─── VERTICAL POSITIONS — from pdfplumber measurements ───────────────
      const TITLE_Y = 63     // title text baseline
      const H1_TOP  = 65     // header row 1 top
      const H1_BOT  = 78     // header row 1 bottom = row 2 top
      const H2_BOT  = 83     // header row 2 bottom = data start
      const DATA_Y  = H2_BOT
      const ROW_H   = 3.56   // (250.1 − 83) / 47 = 3.556 pts per 30-min row
      const HDR_H   = H2_BOT - H1_TOP   // 18 pts total header height

      // ─── TEXT HELPER ─────────────────────────────────────────────────────
      const ct = (text, x, w, y, color, fs, bold) => {
        doc.setFontSize(fs)
        doc.setTextColor(...color)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.text(String(text), x + w / 2, y, { align: 'center' })
      }

      // ─── DATE LABEL ──────────────────────────────────────────────────────
      const dateLbl = (slotMins, off) => {
        const d = slotMins - off
        return d < 0 ? 'Prev Date' : d >= 1440 ? 'Next Date' : 'Same Date'
      }

      // ─── ACTIVE ENGINEERS AT A SLOT ──────────────────────────────────────
      const getActive = (slotMins, dayId) => {
        const out = []
        engineers.forEach(eng => {
          const e = schedule[eng.id]?.[dayId]
          if (!e || e.status !== 'WORKING') return
          const s   = parseTimeToMins(e.startTime)
          const end = parseTimeToMins(e.endTime)
          const active = end > s
            ? (slotMins >= s && slotMins < end)
            : (slotMins >= s || slotMins < end)
          if (active) out.push({ name: eng.name, isStart: slotMins === s, isOnCall: !!e.isOnCall })
        })
        return out.sort((a, b) => a.name.localeCompare(b.name))
      }

      // ─── TITLE ───────────────────────────────────────────────────────────
      doc.setFontSize(7)
      doc.setTextColor(...BLACK)
      doc.setFont('helvetica', 'bold')
      doc.text(weekLabel, PW / 2, TITLE_Y, { align: 'center' })

      // ─── HEADER BACKGROUND — TZ column color bands (both rows combined) ──
      // EST band: light blue
      doc.setFillColor(221, 234, 247)
      doc.rect(M,                                    H1_TOP, EL+EDL,       HDR_H, 'F')
      doc.rect(DAY_END + IR+PR+PDR,                  H1_TOP, ER+EDR,       HDR_H, 'F')
      // PST band: light yellow
      doc.setFillColor(255, 248, 195)
      doc.rect(M + EL+EDL,                           H1_TOP, PL+PDL,       HDR_H, 'F')
      doc.rect(DAY_END + IR,                         H1_TOP, PR+PDR,       HDR_H, 'F')
      // IST band: light green
      doc.setFillColor(226, 239, 218)
      doc.rect(M + EL+EDL+PL+PDL,                   H1_TOP, IL,           HDR_H, 'F')
      doc.rect(DAY_END,                              H1_TOP, IR,           HDR_H, 'F')

      // ─── HEADER ROW 1: TZ group labels + day names ───────────────────────
      const h1Y = H1_TOP + (H1_BOT - H1_TOP) * 0.72   // ≈ 74.4 pt

      // Left TZ group labels
      ct('EST',  M,              EL+EDL,    h1Y, TEAL,  4.5, true)
      ct('PST',  M + EL+EDL,    PL+PDL,    h1Y, PLUM,  4.5, true)
      ct('IST',  M + EL+EDL+PL+PDL, IL,   h1Y, DKBLUE, 4.5, true)
      // Right TZ group labels
      ct('IST',  DAY_END,           IR,          h1Y, DKBLUE, 4.5, true)
      ct('PST',  DAY_END + IR,      PR+PDR,      h1Y, PLUM,   4.5, true)
      ct('EST',  DAY_END + IR+PR+PDR, ER+EDR,   h1Y, TEAL,   4.5, true)

      // Day name backgrounds + labels
      days.forEach((day, di) => {
        const dx = DAY_X + di * DAY_W
        doc.setFillColor(...(day.isWeekend ? [255, 252, 210] : [236, 242, 254]))
        doc.rect(dx, H1_TOP, DAY_W, H1_BOT - H1_TOP, 'F')
        ct(`${day.label}, ${day.date}`, dx, DAY_W, h1Y, BLACK, 4, true)
      })

      // ─── HEADER ROW 2: Sub-col labels + "Eng N" per day ─────────────────
      const h2Y = H1_BOT + (H2_BOT - H1_BOT) * 0.72   // ≈ 81.6 pt

      let hx = M
      ct('EST',      hx, EL,  h2Y, TEAL,   3.5, true); hx += EL
      ct('EST Date', hx, EDL, h2Y, TEAL,   3,   true); hx += EDL
      ct('PST',      hx, PL,  h2Y, PLUM,   3.5, true); hx += PL
      ct('PST Date', hx, PDL, h2Y, PLUM,   3,   true); hx += PDL
      ct('IST',      hx, IL,  h2Y, DKBLUE, 3.5, true); hx += IL

      days.forEach((day, di) => {
        doc.setFillColor(...(day.isWeekend ? [255, 252, 210] : [236, 242, 254]))
        doc.rect(hx + di * DAY_W, H1_BOT, DAY_W, H2_BOT - H1_BOT, 'F')
        for (let ei = 0; ei < 8; ei++) {
          ct(`Eng ${ei + 1}`, hx + di * DAY_W + ei * ENG_W, ENG_W, h2Y, BLACK, 2.8, true)
        }
      })
      hx += DAY_AREA

      ct('IST',      hx, IR,  h2Y, DKBLUE, 3.5, true); hx += IR
      ct('PST',      hx, PR,  h2Y, PLUM,   3.5, true); hx += PR
      ct('PST Date', hx, PDR, h2Y, PLUM,   3,   true); hx += PDR
      ct('EST',      hx, ER,  h2Y, TEAL,   3.5, true); hx += ER
      ct('EST Date', hx, EDR, h2Y, TEAL,   3,   true)

      // ─── DATA ROWS ───────────────────────────────────────────────────────
      ALL_SLOTS.forEach((slotMins, ri) => {
        const rowY   = DATA_Y + ri * ROW_H
        const textY  = rowY + ROW_H * 0.78
        const isHour = slotMins % 60 === 0

        const istLbl = minsToLabel(slotMins)
        const estLbl = minsToLabel((slotMins - EST_OFF + 2880) % 1440)
        const pstLbl = minsToLabel((slotMins - PST_OFF + 2880) % 1440)
        const estDt  = dateLbl(slotMins, EST_OFF)
        const pstDt  = dateLbl(slotMins, PST_OFF)

        // Alternating row shade
        if (ri % 2 === 0) {
          doc.setFillColor(249, 250, 252)
          doc.rect(M, rowY, PW - M * 2, ROW_H, 'F')
        }

        // Horizontal gridline — heavier on the hour
        doc.setDrawColor(...LGRAY)
        doc.setLineWidth(isHour ? 0.28 : 0.06)
        doc.line(M, rowY, PW - M, rowY)

        // Left TZ
        let cx = M
        ct(estLbl, cx, EL,  textY, TEAL,   2,   false); cx += EL
        ct(estDt,  cx, EDL, textY, TEAL,   1.75, false); cx += EDL
        ct(pstLbl, cx, PL,  textY, PLUM,   2,   false); cx += PL
        ct(pstDt,  cx, PDL, textY, PLUM,   1.75, false); cx += PDL
        ct(istLbl, cx, IL,  textY, DKBLUE, 2,   isHour); cx += IL

        // Engineer day columns
        days.forEach(day => {
          const active = getActive(slotMins, day.id)
          active.forEach((eng, ei) => {
            if (ei >= 8) return
            const ex    = cx + ei * ENG_W
            const color = eng.isStart ? GREEN : BLACK
            const label = eng.isOnCall ? `${eng.name} OCS` : eng.name
            ct(label, ex, ENG_W, textY, color, 1.9, eng.isStart)
          })
          cx += DAY_W
        })

        // Right TZ
        ct(istLbl, cx, IR,  textY, DKBLUE, 2,   isHour); cx += IR
        ct(pstLbl, cx, PR,  textY, PLUM,   2,   false);  cx += PR
        ct(pstDt,  cx, PDR, textY, PLUM,   1.75, false); cx += PDR
        ct(estLbl, cx, ER,  textY, TEAL,   2,   false);  cx += ER
        ct(estDt,  cx, EDR, textY, TEAL,   1.75, false)
      })

      // ─── GRID BORDERS ────────────────────────────────────────────────────
      const TOTAL_H = ALL_SLOTS.length * ROW_H   // ≈ 171 pts

      // Outer box (full grid including headers)
      doc.setDrawColor(80, 80, 80)
      doc.setLineWidth(0.5)
      doc.rect(M, H1_TOP, PW - M * 2, HDR_H + TOTAL_H)

      // Strong TZ ↔ day-area dividers
      doc.setLineWidth(0.5)
      doc.line(DAY_X,   H1_TOP, DAY_X,   DATA_Y + TOTAL_H)
      doc.line(DAY_END, H1_TOP, DAY_END, DATA_Y + TOTAL_H)

      // Left TZ internal dividers
      doc.setDrawColor(...LGRAY)
      doc.setLineWidth(0.1)
      let vx = M
      for (const w of [EL, EDL, PL, PDL]) {
        vx += w; doc.line(vx, H1_TOP, vx, DATA_Y + TOTAL_H)
      }

      // Right TZ internal dividers
      vx = DAY_END
      for (const w of [IR, PR, PDR, ER]) {
        vx += w; doc.line(vx, H1_TOP, vx, DATA_Y + TOTAL_H)
      }

      // Day-to-day dividers (medium weight)
      doc.setDrawColor(120, 120, 120)
      doc.setLineWidth(0.25)
      for (let di = 1; di < 7; di++) {
        const dvx = DAY_X + di * DAY_W
        doc.line(dvx, H1_TOP, dvx, DATA_Y + TOTAL_H)
      }

      // Eng sub-col dividers within each day (very fine, data rows only)
      doc.setDrawColor(...LGRAY)
      doc.setLineWidth(0.05)
      for (let di = 0; di < 7; di++) {
        for (let ei = 1; ei < 8; ei++) {
          const evx = DAY_X + di * DAY_W + ei * ENG_W
          doc.line(evx, H1_BOT, evx, DATA_Y + TOTAL_H)
        }
      }

      // Header row 1 / row 2 separator
      doc.setDrawColor(150, 150, 150)
      doc.setLineWidth(0.15)
      doc.line(M, H1_BOT, PW - M, H1_BOT)

      // ─── FOOTER ──────────────────────────────────────────────────────────
      const footY = DATA_Y + TOTAL_H + 4
      doc.setFontSize(5)
      doc.setTextColor(...BLACK)
      doc.setFont('helvetica', 'bold')
      doc.text(weekLabel, PW / 2, footY, { align: 'center' })

      // Footer day strip
      doc.setFontSize(4)
      doc.setFont('helvetica', 'normal')
      const dayStr = days.map(d => d.label).join('   ')
      doc.text(`EST  PST  ${dayStr}  PST  EST`, PW / 2, footY + 5, { align: 'center' })

      // Legend row
      const legend = [
        { t: 'Red Font - on Leave',         c: RED    },
        { t: 'Blue Font - Weekly Off',       c: DKBLUE },
        { t: 'Green - Start of the shift',   c: GREEN  },
        { t: 'Purple Font - Public Holiday', c: PURPLE },
        { t: 'Pink Font - Com off',          c: PINK   },
      ]
      doc.setFontSize(3.5)
      let lx = M + 40
      legend.forEach(item => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...item.c)
        doc.text(item.t, lx, footY + 10)
        lx += doc.getTextWidth(item.t) + 8
      })

      // ─── PAGE 2: ENGINEER SUMMARY ────────────────────────────────────────
      if (includeSummary) {
        doc.addPage([792, 612], 'landscape')
        const W2 = 792, sm = 30
        doc.setFillColor(1, 77, 69)
        doc.rect(0, 0, W2, 28, 'F')
        doc.setFontSize(14); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold')
        doc.text('Engineer Summary', sm, 14)
        doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(204,251,241)
        doc.text(weekLabel, sm, 22)

        const sumHeaders = ['Engineer','Shift','Working','Weekly Off','Annual Leave','Comp Off','Sick Leave','Public Hol','On Call Days']
        const sumRows = summary.map(({ eng, counts, onCallDays }) => [
          eng.name, SHIFTS[eng.shift]?.label || eng.shift,
          counts.WORKING||0, counts.WEEKLY_OFF||0, counts.ANNUAL_LEAVE||0,
          counts.COMP_OFF||0, counts.SICK_LEAVE||0, counts.PUBLIC_HOL||0, onCallDays,
        ])
        autoTable(doc, {
          head: [sumHeaders], body: sumRows, startY: 35,
          margin: { left: sm, right: sm },
          styles: { fontSize: 9, cellPadding: 4, valign: 'middle', halign: 'center', lineColor: [226,232,240], lineWidth: 0.5 },
          headStyles: { fillColor: [10,138,122], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240,253,250] },
          columnStyles: { 0: { fontStyle: 'bold', halign: 'left', cellWidth: 45 }, 1: { halign: 'left', cellWidth: 35 } },
        })
      }

      doc.save(`Roster_${activeWeekId}.pdf`)
    } catch (err) { console.error('PDF export error:', err) }
    setExporting(false)
  }


  async function generateShareLink() {
    setSavingLink(true)
    const snapshot = {
      weekLabel, generatedAt: new Date().toISOString(),
      days: days.map(d => ({id:d.id,label:d.label,short:d.short,date:d.date,isWeekend:d.isWeekend})),
      engineers: engineers.map(e => ({id:e.id,name:e.name,role:e.role,shift:e.shift})),
      schedule,
    }
    const { id, remote } = await saveSnapshot(snapshot)
    setLinkIsRemote(remote)
    setShareLink(`${window.location.origin}${window.location.pathname}#/view/${id}`)
    setCopied(false)
    setSavingLink(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page-container pub-page">
      {/* MAIN CONTENT */}
      <header className="pub-hero">
        <div className="pub-hero-main">
          <h1 className="pub-title">Publishing Center</h1>
          <p className="pub-subtitle">Export reports or generate a shareable roster link</p>
        </div>
        <div className="pub-hero-week">{weekLabel}</div>
      </header>

      <section>
        <h2 className="pub-section-title">
          <span className="pub-section-icon" style={{background:'#d1fae5',color:'#059669'}}><Icon d={Icons.check} size={15}/></span>
          Weekly Analytics
        </h2>
        <div className="pub-analytics-grid">
          {[
            {label:'Engineers', value:engineers.length, icon:Icons.users, color:'#0ea5e9', bg:'#e0f2fe'},
            {label:'Working',   value:analytics.totalWorking, icon:Icons.check, color:'#059669', bg:'#d1fae5'},
            {label:'On Leave',  value:analytics.totalLeave,   icon:Icons.leave, color:'#dc2626', bg:'#fee2e2'},
            {label:'Weekly Off',value:analytics.totalWO,      icon:Icons.calendar, color:'#0d9488', bg:'#ccfbf1'},
            {label:'On Call',   value:analytics.totalOnCall,  icon:Icons.oncall, color:'#7c3aed', bg:'#ede9fe'},
          ].map(c => (
            <div key={c.label} className="pub-analytics-card">
              <div className="pub-analytics-icon" style={{background:c.bg,color:c.color}}><Icon d={c.icon} size={18}/></div>
              <div className="pub-analytics-num" style={{color:c.color}}>{c.value}</div>
              <div className="pub-analytics-lbl">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="pub-section-title">
          <span className="pub-section-icon" style={{background:'#dbeafe',color:'#2563eb'}}><Icon d={Icons.calendar} size={15}/></span>
          Daily Coverage Report
        </h2>
        <div className="pub-daily-grid">
          {dailyCoverage.map(({day,working,leave,onCall,weeklyOff}) => {
            const pct = engineers.length > 0 ? Math.round((working/engineers.length)*100) : 0
            const low = pct < 50
            return (
              <div key={day.id} className={`pub-day-card${day.isWeekend?' pub-day-weekend':''}`}>
                <div className="pub-day-header"><span className="pub-day-name">{day.short}</span><span className="pub-day-date">{day.date}</span></div>
                <div className="pub-day-bar-wrap">
                  <div className="pub-day-bar"><div className="pub-day-bar-fill" style={{width:`${pct}%`,background:low?'#ef4444':'#10b981'}}/></div>
                  <span className="pub-day-pct" style={{color:low?'#dc2626':'#059669'}}>{pct}%</span>
                </div>
                <div className="pub-day-stats">
                  <div className="pub-day-stat"><span style={{color:'#059669'}}>Working</span><strong>{working}</strong></div>
                  {leave>0 && <div className="pub-day-stat"><span style={{color:'#dc2626'}}>Leave</span><strong>{leave}</strong></div>}
                  {onCall>0 && <div className="pub-day-stat"><span style={{color:'#7c3aed'}}>On Call</span><strong>{onCall}</strong></div>}
                  {weeklyOff>0 && <div className="pub-day-stat"><span style={{color:'#0d9488'}}>Off</span><strong>{weeklyOff}</strong></div>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="pub-two-col">
        <section>
          <h2 className="pub-section-title">
            <span className="pub-section-icon" style={{background:'#fef3c7',color:'#d97706'}}><Icon d={Icons.shift} size={15}/></span>
            Shift Distribution
          </h2>
          <div className="page-card pub-shift-card">
            {Object.entries(shiftDist).map(([key,names]) => {
              const sh = SHIFTS[key]
              return (
                <div key={key} className="pub-shift-row">
                  <div className="pub-shift-left">
                    <span className="shift-badge" style={{background:sh.bg,color:sh.color}}>{sh.label}</span>
                    <span className="pub-shift-count">{names.length} engineer{names.length!==1?'s':''}</span>
                  </div>
                  <div className="pub-shift-names">
                    {names.length>0 ? names.map(n=><span key={n} className="pub-name-chip">{n}</span>) : <span className="pub-empty">None assigned</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
        <section>
          <h2 className="pub-section-title">
            <span className="pub-section-icon" style={{background:'#fee2e2',color:'#dc2626'}}><Icon d={Icons.leave} size={15}/></span>
            Leave Report
          </h2>
          <div className="page-card pub-leave-card">
            {leaveReport.length===0 ? <div className="pub-empty-state">No leave entries this week</div> : (
              <div className="pub-leave-list">
                {leaveReport.map(({eng,day,status},i) => {
                  const s = STATUSES[status]
                  return (
                    <div key={i} className="pub-leave-row">
                      <div className="eng-avatar-sm" style={{background:`linear-gradient(135deg,${s.color},${s.color}aa)`}}>{eng.name[0]}</div>
                      <div className="pub-leave-info"><span className="pub-leave-name">{eng.name}</span><span className="pub-leave-day">{day.label} · {day.date}</span></div>
                      <span className="count-pill" style={{background:s.bg,color:s.color}}>{s.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <section>
        <h2 className="pub-section-title">
          <span className="pub-section-icon" style={{background:'#ede9fe',color:'#7c3aed'}}><Icon d={Icons.oncall} size={15}/></span>
          On Call Coverage
        </h2>
        <div className="page-card">
          {onCallCoverage.length===0 ? <div className="pub-empty-state">No on-call assignments this week</div> : (
            <div className="pub-oncall-grid">
              {onCallCoverage.map(({day,engineers:ocEngs}) => (
                <div key={day.id} className="pub-oncall-card">
                  <div className="pub-oncall-day"><span className="pub-oncall-day-name">{day.label}</span><span className="pub-oncall-day-date">{day.date}</span></div>
                  <div className="pub-oncall-engineers">
                    {ocEngs.map(eng=>(
                      <div key={eng.id} className="pub-oncall-eng">
                        <div className="eng-avatar-sm" style={{width:26,height:26,fontSize:11}}>{eng.name[0]}</div>
                        <span>{eng.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="pub-two-col">

        <section>
          <h2 className="pub-section-title">
            <span className="pub-section-icon" style={{background:'#fce7f3',color:'#db2777'}}><Icon d={Icons.pdf} size={15}/></span>
            PDF Export
          </h2>
          <div className="page-card pub-pdf-card">
            <p className="card-desc">Export a full PDF roster grid with IST / EST / PST timezone columns and an optional Engineer Summary page.</p>
            <div className="pub-pdf-options">
              <label className="pub-checkbox-row"><input type="checkbox" checked={includeSummary} onChange={e=>setIncludeSummary(e.target.checked)}/><span>Include Engineer Summary page</span></label>
              <label className="pub-checkbox-row"><input type="checkbox" checked={includeLegend} onChange={e=>setIncludeLegend(e.target.checked)}/><span>Include Legend &amp; Timezone page</span></label>
            </div>
            <button className="pub-pdf-btn" onClick={handleExport} disabled={exporting}>
              <Icon d={Icons.pdf} size={16}/>
              {exporting ? 'Generating PDF...' : 'Generate & Download PDF'}
            </button>
          </div>
        </section>
        <section>
          <h2 className="pub-section-title">
            <span className="pub-section-icon" style={{background:'#ccfbf1',color:'#0d9488'}}><Icon d={Icons.link} size={15}/></span>
            Share Roster Link
          </h2>
          <div className="page-card pub-share-card">
            <p className="card-desc">Generate a <strong>read-only link</strong> for engineers. The view page includes a full <strong>IST / EST / PST timezone switcher</strong> so engineers can see times in their local timezone.</p>
            {!shareLink ? (
              <button className="pub-share-btn" onClick={generateShareLink} disabled={savingLink}>
                <Icon d={Icons.link} size={16}/>
                {savingLink ? 'Saving snapshot…' : 'Generate Shareable Link'}
              </button>
            ) : (
              <div className="pub-link-result">
                <div className="pub-link-label" style={{display:'flex',alignItems:'center',gap:8}}>
                  Shareable Link
                  <span style={{
                    fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:20,
                    background: linkIsRemote ? '#dcfce7' : '#fef3c7',
                    color: linkIsRemote ? '#166534' : '#92400e',
                  }}>
                    {linkIsRemote ? '🌐 Works on any device' : '⚠️ This device only'}
                  </span>
                </div>
                <div className="pub-link-box"><span className="pub-link-url">{shareLink.length>55?shareLink.slice(0,55)+'…':shareLink}</span></div>
                <div className="pub-link-actions">
                  <button className="btn-primary" onClick={copyLink}><Icon d={Icons.copy} size={14}/>{copied?'Copied!':'Copy Link'}</button>
                  <button className="btn-secondary" onClick={()=>window.open(shareLink,'_blank')}><Icon d={Icons.open} size={14}/>Open Preview</button>
                  <button className="btn-secondary" onClick={()=>{setShareLink(null);setLinkIsRemote(false)}}>Regenerate</button>
                </div>
                <p className="pub-link-note">Snapshot generated on {new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section>
        <h2 className="pub-section-title">
          <span className="pub-section-icon" style={{background:'#e0e7ff',color:'#4f46e5'}}><Icon d={Icons.users} size={15}/></span>
          Engineer Summary — {weekLabel}
        </h2>
        <div className="page-card no-pad">
          <div className="summary-table-wrap">
            <table className="summary-table">
              <thead><tr>
                <th>Engineer</th><th>Shift</th>
                {Object.values(STATUSES).map(s=><th key={s.label}>{s.label}</th>)}
                <th>On Call Days</th>
              </tr></thead>
              <tbody>
                {summary.map(({eng,counts,onCallDays},idx)=>(
                  <tr key={eng.id} className={idx%2===0?'row-even':'row-odd'}>
                    <td className="summary-eng-name"><div className="eng-avatar-sm">{eng.name[0]}</div>{eng.name}</td>
                    <td><span className="shift-badge" style={{background:SHIFTS[eng.shift]?.bg,color:SHIFTS[eng.shift]?.color}}>{SHIFTS[eng.shift]?.label}</span></td>
                    {Object.entries(STATUSES).map(([key,s])=>(
                      <td key={key} className="summary-count">
                        {counts[key]>0?<span className="count-pill" style={{background:s.bg,color:s.color}}>{counts[key]}</span>:<span className="count-zero">—</span>}
                      </td>
                    ))}
                    <td className="summary-count">
                      {onCallDays>0?<span className="count-pill" style={{background:'#cffafe',color:'#0891b2'}}>{onCallDays}</span>:<span className="count-zero">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
