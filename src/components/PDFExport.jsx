import React, { useState } from 'react'
import jsPDF from 'jspdf'
import { useRosterStore } from '../store/rosterStore.js'

const STATUSES = {
  WORKING:        { label: 'Working',        short: null },
  WEEKLY_OFF:     { label: 'Weekly Off',     short: 'W/Off' },
  ANNUAL_LEAVE:   { label: 'Annual Leave',   short: 'A/Leave' },
  SICK_LEAVE:     { label: 'Sick Leave',     short: 'Sick' },
  COMP_OFF:       { label: 'Comp Off',       short: 'Comp Off' },
  PUBLIC_HOLIDAY: { label: 'Public Holiday', short: 'P/Holiday' },
}

// IST offset = +5:30 (330 mins)
// EST offset = -5:00 (-300 mins)  → IST - 10:30
// PST offset = -8:00 (-480 mins)  → IST - 13:30
function convertFromIST(timeStr, tz) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const istMins = h * 60 + m
  let offset = 0
  if (tz === 'EST') offset = -(10 * 60 + 30)
  if (tz === 'PST') offset = -(13 * 60 + 30)
  let mins = ((istMins + offset) % 1440 + 1440) % 1440
  const hh = Math.floor(mins / 60)
  const mm = mins % 60
  const period = hh < 12 ? 'AM' : 'PM'
  const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh
  return `${h12}:${mm.toString().padStart(2, '0')} ${period}`
}

function formatTime(t) { return convertFromIST(t, 'IST') }

function getTimeRange(entry, tz) {
  if (!entry || entry.status !== 'WORKING') return null
  const start = convertFromIST(entry.startTime, tz)
  const end   = convertFromIST(entry.endTime,   tz)
  let text = `${start} – ${end}`
  if (entry.isSplit && entry.startTime2 && entry.endTime2) {
    const s2 = convertFromIST(entry.startTime2, tz)
    const e2 = convertFromIST(entry.endTime2,   tz)
    text += `\n${s2} – ${e2}`
  }
  if (entry.onCall) text += ' [OC]'
  return text
}

export default function PDFExport() {
  const { engineers, weeks, activeWeekId } = useRosterStore()
  const [generating, setGenerating] = useState(false)

  const handleExport = () => {
    setGenerating(true)
    try {
      const week   = weeks.find(w => w.id === activeWeekId) || weeks[0]
      const days   = week?.days || []
      const label  = week?.label || 'Roster'

      // ── Page setup ──────────────────────────────────────────────
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a3' })
      const PW  = doc.internal.pageSize.getWidth()   // 1190.55 pt
      const PH  = doc.internal.pageSize.getHeight()  //  841.89 pt

      // Colors
      const TEAL      = [13,  110, 100]
      const TEAL_DARK = [5,   75,  68]
      const TEAL_LIGHT= [220, 242, 240]
      const TEAL_MED  = [180, 225, 220]
      const WHITE     = [255, 255, 255]
      const GRAY_ROW  = [248, 250, 249]
      const GRAY_HEAD = [240, 245, 244]
      const BORDER    = [180, 200, 198]
      const WO_COL    = [8,   145, 178]   // blue  – weekly off
      const LEAVE_COL = [220, 38,  38]    // red   – leave
      const COMP_COL  = [219, 39,  119]   // pink  – comp off
      const PH_COL    = [124, 58,  237]   // purple– public holiday
      const TEAL_TEXT = [13,  110, 100]   // teal  – working time

      // ── Column widths ────────────────────────────────────────────
      const MARGIN  = 18
      const ENG_W   = 90   // Engineer name
      const SHIFT_W = 52   // Shift type
      const TZ_W    = 30   // IST/EST/PST label
      const usable  = PW - MARGIN * 2 - ENG_W - SHIFT_W - TZ_W
      const DAY_W   = usable / days.length   // width per day column

      // Row heights
      const HEADER_H1 = 22   // title row
      const HEADER_H2 = 18   // day name row
      const SUB_ROW_H = 14   // each TZ sub-row

      // ── Title / header ───────────────────────────────────────────
      let y = MARGIN

      // Title bar
      doc.setFillColor(...TEAL_DARK)
      doc.rect(MARGIN, y, PW - MARGIN * 2, HEADER_H1, 'F')
      doc.setTextColor(...WHITE)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('Roster Management', MARGIN + 8, y + 14)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(label, MARGIN + 8, y + 20)
      y += HEADER_H1

      // Day header row
      doc.setFillColor(...TEAL)
      doc.rect(MARGIN, y, ENG_W + SHIFT_W + TZ_W, HEADER_H2, 'F')
      doc.setTextColor(...WHITE)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.text('Engineer', MARGIN + 4, y + 12)

      let dx = MARGIN + ENG_W + SHIFT_W + TZ_W
      days.forEach(day => {
        const isWE = day.label === 'Saturday' || day.label === 'Sunday'
        doc.setFillColor(...(isWE ? TEAL_DARK : TEAL))
        doc.rect(dx, y, DAY_W, HEADER_H2, 'F')
        doc.setTextColor(...WHITE)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6.5)
        const dayLabel = `${day.label.slice(0, 3)}  ${day.id ? new Date(day.id + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}`
        doc.text(dayLabel, dx + DAY_W / 2, y + 12, { align: 'center' })
        dx += DAY_W
      })
      y += HEADER_H2

      // Column sub-headers (Shift | TZ labels)
      doc.setFillColor(...GRAY_HEAD)
      doc.rect(MARGIN, y, ENG_W + SHIFT_W + TZ_W, SUB_ROW_H, 'F')
      doc.setTextColor(80, 80, 80)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6)
      doc.text('Shift', MARGIN + ENG_W + 4, y + 9)
      doc.text('TZ',    MARGIN + ENG_W + SHIFT_W + 4, y + 9)

      dx = MARGIN + ENG_W + SHIFT_W + TZ_W
      days.forEach(day => {
        const isWE = day.label === 'Saturday' || day.label === 'Sunday'
        doc.setFillColor(...(isWE ? TEAL_MED : TEAL_LIGHT))
        doc.rect(dx, y, DAY_W, SUB_ROW_H, 'F')
        doc.setTextColor(...TEAL_DARK)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(5.5)
        doc.text('IST  |  EST  |  PST', dx + DAY_W / 2, y + 9, { align: 'center' })
        dx += DAY_W
      })
      y += SUB_ROW_H

      // ── Engineer rows ────────────────────────────────────────────
      const sortedEngineers = [...engineers].sort((a, b) => a.name.localeCompare(b.name))

      sortedEngineers.forEach((eng, ei) => {
        const rowBg = ei % 2 === 0 ? WHITE : GRAY_ROW
        const TZS   = ['IST', 'EST', 'PST']
        const rowH  = SUB_ROW_H * 3 + 2  // total height for this engineer

        // Check if we need a new page
        if (y + rowH > PH - MARGIN) {
          doc.addPage()
          y = MARGIN
        }

        // Engineer name cell (spans 3 sub-rows)
        doc.setFillColor(...rowBg)
        doc.rect(MARGIN, y, ENG_W, rowH, 'F')
        doc.setDrawColor(...BORDER)
        doc.rect(MARGIN, y, ENG_W, rowH)
        doc.setTextColor(30, 30, 30)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.text(eng.name, MARGIN + 4, y + rowH / 2 + 2)

        // Shift type cell (spans 3 sub-rows)
        doc.setFillColor(...rowBg)
        doc.rect(MARGIN + ENG_W, y, SHIFT_W, rowH, 'F')
        doc.rect(MARGIN + ENG_W, y, SHIFT_W, rowH)
        doc.setTextColor(80, 80, 80)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(6)
        doc.text(eng.shift || '', MARGIN + ENG_W + 4, y + rowH / 2 + 2)

        // 3 TZ sub-rows
        TZS.forEach((tz, ti) => {
          const sy = y + ti * SUB_ROW_H + ti * 0.5

          // TZ label cell
          doc.setFillColor(...(tz === 'IST' ? [220,242,240] : tz === 'EST' ? [219,234,254] : [237,233,254]))
          doc.rect(MARGIN + ENG_W + SHIFT_W, sy, TZ_W, SUB_ROW_H, 'F')
          doc.rect(MARGIN + ENG_W + SHIFT_W, sy, TZ_W, SUB_ROW_H)
          doc.setTextColor(...(tz === 'IST' ? TEAL_DARK : tz === 'EST' ? [30,64,175] : [91,33,182]))
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(5.5)
          doc.text(tz, MARGIN + ENG_W + SHIFT_W + TZ_W / 2, sy + 9, { align: 'center' })

          // Day cells for this TZ row
          dx = MARGIN + ENG_W + SHIFT_W + TZ_W
          days.forEach(day => {
            const isWE  = day.label === 'Saturday' || day.label === 'Sunday'
            const entry = (day.engineers || {})[eng.id] || {}
            const status = entry.status || 'WORKING'

            doc.setFillColor(...(isWE ? [245,250,249] : rowBg))
            doc.rect(dx, sy, DAY_W, SUB_ROW_H, 'F')
            doc.setDrawColor(...BORDER)
            doc.rect(dx, sy, DAY_W, SUB_ROW_H)

            let cellText = ''
            let textColor = [30, 30, 30]

            if (status === 'WORKING') {
              const timeRange = getTimeRange(entry, tz)
              if (timeRange) {
                cellText = timeRange
                textColor = tz === 'IST' ? TEAL_DARK : tz === 'EST' ? [30,64,175] : [91,33,182]
              }
            } else {
              const shortMap = {
                WEEKLY_OFF:     { text: 'W/Off',     color: WO_COL },
                ANNUAL_LEAVE:   { text: 'A/Leave',   color: LEAVE_COL },
                SICK_LEAVE:     { text: 'Sick',      color: LEAVE_COL },
                COMP_OFF:       { text: 'Comp Off',  color: COMP_COL },
                PUBLIC_HOLIDAY: { text: 'P/Holiday', color: PH_COL },
              }
              const s = shortMap[status]
              if (s && ti === 1) { // only show label on EST row to avoid repetition
                cellText  = s.text
                textColor = s.color
              } else if (s && ti !== 1) {
                cellText  = '—'
                textColor = [180, 180, 180]
              }
            }

            doc.setFont('helvetica', status === 'WORKING' ? 'normal' : 'bold')
            doc.setFontSize(5.5)
            doc.setTextColor(...textColor)

            // Handle split shift (two lines)
            if (cellText.includes('\n')) {
              const parts = cellText.split('\n')
              doc.text(parts[0], dx + DAY_W / 2, sy + 5, { align: 'center' })
              doc.text(parts[1], dx + DAY_W / 2, sy + 10, { align: 'center' })
            } else {
              doc.text(cellText, dx + DAY_W / 2, sy + 9, { align: 'center' })
            }

            dx += DAY_W
          })
        })

        // Bottom border for this engineer
        doc.setDrawColor(...BORDER)
        doc.setLineWidth(0.8)
        doc.line(MARGIN, y + rowH, PW - MARGIN, y + rowH)
        doc.setLineWidth(0.2)

        y += rowH + 2
      })

      // ── Legend ───────────────────────────────────────────────────
      y += 6
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...TEAL_DARK)
      doc.text('Legend:', MARGIN, y)
      const legends = [
        { text: 'W/Off = Weekly Off',      color: WO_COL },
        { text: 'A/Leave = Annual Leave',  color: LEAVE_COL },
        { text: 'Sick = Sick Leave',       color: LEAVE_COL },
        { text: 'Comp Off = Compensatory', color: COMP_COL },
        { text: 'P/Holiday = Public Hol.', color: PH_COL },
        { text: '[OC] = On Call',          color: TEAL_DARK },
      ]
      let lx = MARGIN + 40
      legends.forEach(l => {
        doc.setTextColor(...l.color)
        doc.setFont('helvetica', 'normal')
        doc.text(l.text, lx, y)
        lx += 120
      })

      // ── Page 2 — Engineer Summary ────────────────────────────────
      doc.addPage()
      y = MARGIN

      doc.setFillColor(...TEAL_DARK)
      doc.rect(MARGIN, y, PW - MARGIN * 2, 24, 'F')
      doc.setTextColor(...WHITE)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('Engineer Summary', MARGIN + 8, y + 16)
      y += 30

      // Summary table header
      const cols = ['Engineer', 'Shift', 'Working Days', 'Weekly Off', 'Annual Leave', 'Sick Leave', 'Comp Off', 'Public Hol.', 'On Call']
      const cw   = [(PW - MARGIN * 2) * 0.14, (PW - MARGIN * 2) * 0.08]
      const remW = (PW - MARGIN * 2 - cw[0] - cw[1]) / (cols.length - 2)

      doc.setFillColor(...TEAL)
      doc.rect(MARGIN, y, PW - MARGIN * 2, 16, 'F')
      doc.setTextColor(...WHITE)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      let cx = MARGIN
      cols.forEach((c, i) => {
        const w = i === 0 ? cw[0] : i === 1 ? cw[1] : remW
        doc.text(c, cx + 4, y + 11)
        cx += w
      })
      y += 16

      sortedEngineers.forEach((eng, ei) => {
        const counts = { working: 0, weeklyOff: 0, annualLeave: 0, sickLeave: 0, compOff: 0, publicHol: 0, onCall: 0 }
        days.forEach(day => {
          const entry = (day.engineers || {})[eng.id] || {}
          const s = entry.status || 'WORKING'
          if (s === 'WORKING')        { counts.working++;   if (entry.onCall) counts.onCall++ }
          if (s === 'WEEKLY_OFF')     counts.weeklyOff++
          if (s === 'ANNUAL_LEAVE')   counts.annualLeave++
          if (s === 'SICK_LEAVE')     counts.sickLeave++
          if (s === 'COMP_OFF')       counts.compOff++
          if (s === 'PUBLIC_HOLIDAY') counts.publicHol++
        })

        doc.setFillColor(...(ei % 2 === 0 ? WHITE : GRAY_ROW))
        doc.rect(MARGIN, y, PW - MARGIN * 2, 14, 'F')
        doc.setDrawColor(...BORDER)
        doc.rect(MARGIN, y, PW - MARGIN * 2, 14)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(30, 30, 30)

        const vals = [eng.name, eng.shift || '', counts.working, counts.weeklyOff, counts.annualLeave, counts.sickLeave, counts.compOff, counts.publicHol, counts.onCall]
        cx = MARGIN
        vals.forEach((v, i) => {
          const w = i === 0 ? cw[0] : i === 1 ? cw[1] : remW
          doc.setFont('helvetica', i < 2 ? 'bold' : 'normal')
          doc.text(String(v), cx + 4, y + 9)
          cx += w
        })
        y += 14
      })

      // Save
      const filename = `Roster_${label.replace(/\s+/g, '_')}.pdf`
      doc.save(filename)
    } catch (err) {
      console.error('PDF error:', err)
      alert('PDF generation failed: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="pdf-export-section">
      <div className="pdf-header">
        <h3>PDF Export</h3>
        <p>Download the full roster with IST · EST · PST times for all engineers</p>
      </div>
      <button
        className="btn-primary pdf-btn"
        onClick={handleExport}
        disabled={generating}
      >
        {generating ? 'Generating…' : '⬇ Generate & Download PDF'}
      </button>
    </div>
  )
}