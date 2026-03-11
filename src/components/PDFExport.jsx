import React, { useState, useMemo } from 'react'
import { saveSnapshot } from '../utils/supabase.js'
import { useRosterStore, STATUSES, SHIFTS } from '../store/rosterStore.js'
import { convertTime, TZ_INFO } from '../utils/timezone.js'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'


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
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [841, 1400] })
      const PW = doc.internal.pageSize.getWidth()
      const tz = timezone || 'IST'

      // ─── HEADER BANNER ───────────────────────────────────────────────────
      doc.setFillColor(1, 77, 69)
      doc.rect(0, 0, PW, 36, 'F')
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('Roster Management', 20, 15)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(153, 246, 228)
      doc.text(weekLabel, 20, 27)
      doc.setTextColor(153, 246, 228)
      doc.setFontSize(8)
      doc.text(`Generated ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}`, PW - 20, 27, { align: 'right' })

      // ─── TZ HELPER ───────────────────────────────────────────────────────
      const TZ_OFFSETS = { IST: 0, EST: -630, PST: -810 }
      function shiftTime(istStr, tzKey) {
        if (!istStr) return '—'
        const [time, ampm] = istStr.trim().split(' ')
        let [h, m] = time.split(':').map(Number)
        if (ampm === 'PM' && h !== 12) h += 12
        if (ampm === 'AM' && h === 12) h = 0
        let mins = h * 60 + m + TZ_OFFSETS[tzKey]
        mins = ((mins % 1440) + 1440) % 1440
        const hh = Math.floor(mins / 60), mm = mins % 60
        const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh
        const ap = hh < 12 ? 'AM' : 'PM'
        return `${h12}:${mm.toString().padStart(2,'0')} ${ap}`
      }

      const STATUS_COLORS = {
        WORKING:      { text: [22, 163, 74],   bg: [220, 252, 231] },
        WEEKLY_OFF:   { text: [8, 145, 178],   bg: [207, 250, 254] },
        ANNUAL_LEAVE: { text: [220, 38, 38],   bg: [254, 226, 226] },
        COMP_OFF:     { text: [219, 39, 119],  bg: [252, 231, 243] },
        SICK_LEAVE:   { text: [217, 119, 6],   bg: [254, 243, 199] },
        PUBLIC_HOL:   { text: [124, 58, 237],  bg: [237, 233, 254] },
      }
      const SHIFT_COLORS = {
        Morning:   { text: [6, 95, 70],   bg: [209, 250, 229] },
        Night:     { text: [55, 48, 163], bg: [224, 231, 255] },
        Afternoon: { text: [146, 64, 14], bg: [254, 243, 199] },
        Evening:   { text: [124, 45, 18], bg: [255, 237, 213] },
      }

      const STATUS_SHORT = {
        WORKING:      'Working',
        WEEKLY_OFF:   'W/Off',
        ANNUAL_LEAVE: 'A/Leave',
        COMP_OFF:     'Comp Off',
        SICK_LEAVE:   'Sick',
        PUBLIC_HOL:   'P/Hol',
      }

      // ─── BUILD TABLE: Engineer | Shift | [Mon IST, Mon EST, Mon PST] ... ──
      // Two header rows: row1 = day name spanning 3 cols, row2 = IST/EST/PST
      const TZS = ['IST', 'EST', 'PST']
      const TZ_COLORS = {
        IST: { bg: [226, 239, 218], text: [0, 64, 0]   },
        EST: { bg: [221, 234, 247], text: [0, 0, 100]  },
        PST: { bg: [255, 248, 195], text: [75, 0, 130] },
      }

      // jspdf-autotable supports a single head array so we'll use didDrawCell
      // to draw the two-row header manually and use a single head row for layout
      const colStyles = {
        0: { cellWidth: 60, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 36, halign: 'center' },
      }
      // Each TZ sub-column per day
      const TZ_COL_W = 72
      days.forEach((_, di) => {
        TZS.forEach((_, ti) => {
          colStyles[2 + di * 3 + ti] = { cellWidth: TZ_COL_W, halign: 'center', fontSize: 6.5 }
        })
      })

      // Single header row (we'll overdraw day names on top)
      const headRow = ['Engineer', 'Shift', ...days.flatMap(d => TZS.map(tz => tz))]

      const bodyRows = engineers.map(eng => {
        const row = [eng.name, SHIFTS[eng.shift]?.label || eng.shift]
        days.forEach(day => {
          const e = schedule[eng.id]?.[day.id]
          TZS.forEach(tz => {
            if (!e) { row.push('—'); return }
            if (e.status === 'WORKING' && e.startTime) {
              const s = shiftTime(e.startTime, tz)
              const en = shiftTime(e.endTime, tz)
              let cell = `${s} – ${en}${e.isOnCall ? ' 🔔' : ''}`
              if (e.isSplit && e.startTime2) {
                const s2 = shiftTime(e.startTime2, tz)
                const en2 = shiftTime(e.endTime2, tz)
                cell += `\n${s2} – ${en2}`
              }
              row.push(cell)
            } else {
              row.push(STATUS_SHORT[e.status] || e.status)
            }
          })
        })
        return row
      })

      let mainTableEndY = 44
      autoTable(doc, {
        head: [headRow],
        body: bodyRows,
        startY: 52, // leave room for day-name overlay row
        margin: { left: 10, right: 10 },
        tableWidth: 'auto',
        styles: {
          fontSize: 7,
          cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
          valign: 'middle',
          lineColor: [200, 220, 215],
          lineWidth: 0.3,
          overflow: 'linebreak',
          minCellHeight: 18,
        },
        headStyles: {
          fillColor: [10, 138, 122],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 7.5,
          halign: 'center',
          valign: 'middle',
          minCellHeight: 14,
        },
        columnStyles: colStyles,
        alternateRowStyles: { fillColor: [240, 253, 250] },
        didParseCell(data) {
          if (data.section !== 'body') return
          const col = data.column.index
          const row = data.row.index
          const eng = engineers[row]
          if (!eng) return
          if (col === 1) {
            const sc = SHIFT_COLORS[eng.shift]
            if (sc) { data.cell.styles.fillColor = sc.bg; data.cell.styles.textColor = sc.text }
            return
          }
          if (col >= 2) {
            const dayIdx = Math.floor((col - 2) / 3)
            const e = schedule[eng.id]?.[days[dayIdx]?.id]
            if (!e) return
            const sc = STATUS_COLORS[e.status]
            if (sc) { data.cell.styles.fillColor = sc.bg; data.cell.styles.textColor = sc.text }
          }
        },
        didDrawCell(data) {
          // Draw TZ color band on header cells
          if (data.section === 'head' && data.column.index >= 2) {
            const tzIdx = (data.column.index - 2) % 3
            const tz = TZS[tzIdx]
            const tc = TZ_COLORS[tz]
            doc.setFillColor(...tc.bg)
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F')
            doc.setFontSize(7); doc.setFont('helvetica', 'bold')
            doc.setTextColor(...tc.text)
            doc.text(tz, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 2.5, { align: 'center' })
          }
        },
        didDrawPage(data) {
          mainTableEndY = data.cursor?.y || mainTableEndY
          // Draw day-name row above the TZ header
          const tableLeft = data.settings.margin.left
          const headerY = data.settings.startY - 14
          let x = tableLeft
          // Engineer col
          doc.setFillColor(10, 138, 122)
          doc.rect(x, headerY, colStyles[0].cellWidth, 14, 'F')
          x += colStyles[0].cellWidth
          // Shift col
          doc.rect(x, headerY, colStyles[1].cellWidth, 14, 'F')
          x += colStyles[1].cellWidth
          // Day cols
          days.forEach((day, di) => {
            const dayW = TZ_COL_W * 3
            const bg = day.isWeekend ? [6, 78, 59] : [10, 138, 122]
            doc.setFillColor(...bg)
            doc.rect(x, headerY, dayW, 14, 'F')
            doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255)
            doc.text(`${day.short}  ${day.date}`, x + dayW / 2, headerY + 9, { align: 'center' })
            // vertical dividers between days
            doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.5)
            doc.line(x, headerY, x, headerY + 14)
            x += dayW
          })
        },
      })

      // ─── PAGE 2: SUMMARY TABLE ────────────────────────────────────────────
      if (includeSummary) {
        doc.addPage()
        doc.setFillColor(1, 77, 69)
        doc.rect(0, 0, PW, 36, 'F')
        doc.setFontSize(14); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold')
        doc.text('Engineer Summary', 20, 15)
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(153, 246, 228)
        doc.text(weekLabel, 20, 27)

        const sumHeaders = [['Engineer', 'Shift', 'Working', 'Weekly Off', 'Annual Leave', 'Comp Off', 'Sick Leave', 'Public Hol', 'On Call']]
        const sumRows = summary.map(({ eng, counts, onCallDays }) => [
          eng.name, SHIFTS[eng.shift]?.label || eng.shift,
          counts.WORKING || 0, counts.WEEKLY_OFF || 0, counts.ANNUAL_LEAVE || 0,
          counts.COMP_OFF || 0, counts.SICK_LEAVE || 0, counts.PUBLIC_HOL || 0, onCallDays,
        ])
        autoTable(doc, {
          head: sumHeaders, body: sumRows, startY: 44,
          margin: { left: 20, right: 20 },
          styles: { fontSize: 9, cellPadding: 5, valign: 'middle', halign: 'center', lineColor: [226, 232, 240], lineWidth: 0.4 },
          headStyles: { fillColor: [10, 138, 122], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 253, 250] },
          columnStyles: { 0: { fontStyle: 'bold', halign: 'left', cellWidth: 45 }, 1: { halign: 'left', cellWidth: 35 } },
        })
      }

      const safeLabel = weekLabel.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
      doc.save(`Roster_${safeLabel}.pdf`)
    } catch (err) {
      console.error('PDF export error:', err)
    } finally {
      setExporting(false)
    }
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