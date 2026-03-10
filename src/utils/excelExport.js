/**
 * excelExport.js
 * Generates the roster Excel file (exact structure matching reference PDF)
 * using ExcelJS — 8 sub-columns per day, color-coded engineer names.
 *
 * Usage:  import { exportRosterToExcel } from './utils/excelExport'
 *         await exportRosterToExcel({ engineers, days, schedule, weekLabel })
 */

// ── Color constants (match reference PDF exactly) ──────────────────────────
const C = {
  BLACK:  '000000',
  GREEN:  '006400',   // shift start — bold dark green
  RED:    'CC0000',   // annual/sick leave
  PINK:   'C00060',   // comp off
  PURPLE: '6600CC',   // public holiday
  BLUE:   '17375E',   // IST column text
  TEAL:   '1F6060',   // EST column text
  PURP2:  '4B0082',   // PST column text
}

const FILLS = {
  EST:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEAF7' } },
  PST:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } },
  IST:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } },
  DAY:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
  WKD:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9E6' } },
  HDRD:  { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } },
  ALT:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } },
  WHITE: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
  HDR:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF17375E' } },
  SUM:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } },
}

const THIN_BORDER = {
  top:    { style: 'thin', color: { argb: 'FFCCCCCC' } },
  bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  left:   { style: 'thin', color: { argb: 'FFCCCCCC' } },
  right:  { style: 'thin', color: { argb: 'FFCCCCCC' } },
}

// ── Time helpers ──────────────────────────────────────────────────────────
function parseMins(str) {
  const [time, ampm] = str.trim().split(' ')
  let [h, m] = time.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function fmtMins(mins) {
  mins = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(mins / 60), m = mins % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`
}

function dateLbl(slot, offset) {
  const diff = slot - offset
  if (diff < 0) return 'Prev Date'
  if (diff >= 1440) return 'Next Date'
  return 'Same Date'
}

const EST_OFF = 630   // IST − 10h30m
const PST_OFF = 810   // IST − 13h30m
const ALL_SLOTS = Array.from({ length: 48 }, (_, i) => i * 30)
const N_ENG = 8       // sub-columns per day

// ── Main export function ──────────────────────────────────────────────────
export async function exportRosterToExcel({ engineers, days, schedule, weekLabel }) {
  // Dynamically import ExcelJS (must be installed: npm install exceljs file-saver)
  const ExcelJS = (await import('exceljs')).default
  const { saveAs } = await import('file-saver')

  const wb = new ExcelJS.Workbook()
  wb.creator  = 'Roster Management App'
  wb.created  = new Date()

  // ── Sheet 1: Roster ────────────────────────────────────────────────────
  const ws = wb.addWorksheet('Roster', {
    pageSetup: {
      orientation:  'landscape',
      paperSize:    9,         // A4
      fitToPage:    true,
      fitToWidth:   1,
      fitToHeight:  0,
      margins: { left: 0.25, right: 0.25, top: 0.3, bottom: 0.3, header: 0.15, footer: 0.2 },
    },
  })

  // Column layout:
  // 1:EST | 2:EST_Date | 3:PST | 4:PST_Date | 5:IST |
  // 6 … (6+N_DAYS*N_ENG-1): day sub-cols |
  // last-4:IST | last-3:PST | last-2:PST_Date | last-1:EST | last:EST_Date
  const N_DAYS    = days.length
  const COL_EST_L  = 1
  const COL_ESTD_L = 2
  const COL_PST_L  = 3
  const COL_PSTD_L = 4
  const COL_IST_L  = 5
  const COL_DAY0   = 6
  const COL_IST_R  = COL_DAY0 + N_DAYS * N_ENG
  const COL_PST_R  = COL_IST_R  + 1
  const COL_PSTD_R = COL_PST_R  + 1
  const COL_EST_R  = COL_PSTD_R + 1
  const COL_ESTD_R = COL_EST_R  + 1
  const TOTAL_COLS = COL_ESTD_R

  function dayEngCol(dayIdx, engIdx) {
    return COL_DAY0 + dayIdx * N_ENG + engIdx
  }

  // Set column widths
  const cols = ws.columns = Array.from({ length: TOTAL_COLS }, (_, i) => {
    const col = i + 1
    if ([COL_EST_L,COL_PST_L,COL_IST_L,COL_IST_R,COL_PST_R,COL_EST_R].includes(col)) return { width: 7.5 }
    if ([COL_ESTD_L,COL_PSTD_L,COL_PSTD_R,COL_ESTD_R].includes(col)) return { width: 10 }
    return { width: 5.8 }  // engineer sub-columns
  })

  // Helper: style a cell
  function style(cell, { fill, font, align = 'center', border = true, wrap = false } = {}) {
    if (fill)   cell.fill      = fill
    if (font)   cell.font      = { name: 'Calibri', ...font }
    cell.alignment = { horizontal: align, vertical: 'middle', wrapText: wrap }
    if (border) cell.border    = THIN_BORDER
  }

  // ── Row 1: Title ────────────────────────────────────────────────────────
  ws.getRow(1).height = 16
  const titleCell = ws.getCell(1, 1)
  titleCell.value = weekLabel
  style(titleCell, { font: { bold: true, size: 11, color: { argb: 'FF000000' } } })
  ws.mergeCells(1, 1, 1, TOTAL_COLS)

  // ── Row 2: Legend ───────────────────────────────────────────────────────
  ws.getRow(2).height = 12
  const legendItems = [
    { col: COL_EST_L,      text: 'Red Font - on Leave',         color: C.RED    },
    { col: COL_PST_L,      text: 'Blue Font - Weekly Off',      color: C.BLUE   },
    { col: COL_IST_L,      text: 'Green - Start of the shift',  color: C.GREEN  },
    { col: COL_DAY0 + 16,  text: 'Purple Font - Public Holiday',color: C.PURPLE },
    { col: COL_DAY0 + 40,  text: 'Pink Font - Com off',         color: C.PINK   },
  ]
  legendItems.forEach(({ col, text, color }) => {
    const c = ws.getCell(2, col)
    c.value = text
    style(c, { font: { bold: true, size: 6.5, color: { argb: 'FF' + color } }, border: false })
  })

  // ── Row 3: Day headers (merged across 8 eng cols) ───────────────────────
  ws.getRow(3).height = 20

  function hdrCell(row, col, val, fill, color, size = 8) {
    const c = ws.getCell(row, col)
    c.value = val
    style(c, { fill, font: { bold: true, size, color: { argb: 'FF' + color } }, wrap: true })
  }

  hdrCell(3, COL_EST_L,  'EST',      FILLS.EST,  C.TEAL)
  hdrCell(3, COL_ESTD_L, 'EST Date', FILLS.EST,  C.TEAL)
  hdrCell(3, COL_PST_L,  'PST',      FILLS.PST,  C.PURP2)
  hdrCell(3, COL_PSTD_L, 'PST Date', FILLS.PST,  C.PURP2)
  hdrCell(3, COL_IST_L,  'IST',      FILLS.IST,  C.BLUE)

  days.forEach((day, di) => {
    const c1 = dayEngCol(di, 0), c8 = dayEngCol(di, N_ENG - 1)
    const fill = day.isWeekend ? FILLS.WKD : FILLS.HDRD
    hdrCell(3, c1, day.label, fill, C.BLACK, 7)
    ws.mergeCells(3, c1, 3, c8)
  })

  hdrCell(3, COL_IST_R,  'IST',      FILLS.IST,  C.BLUE)
  hdrCell(3, COL_PST_R,  'PST',      FILLS.PST,  C.PURP2)
  hdrCell(3, COL_PSTD_R, 'PST Date', FILLS.PST,  C.PURP2)
  hdrCell(3, COL_EST_R,  'EST',      FILLS.EST,  C.TEAL)
  hdrCell(3, COL_ESTD_R, 'EST Date', FILLS.EST,  C.TEAL)

  // Merge tz cols across rows 3 & 4
  ;[COL_EST_L,COL_ESTD_L,COL_PST_L,COL_PSTD_L,COL_IST_L,
    COL_IST_R,COL_PST_R,COL_PSTD_R,COL_EST_R,COL_ESTD_R].forEach(col => {
    ws.mergeCells(3, col, 4, col)
  })

  // ── Row 4: "Eng 1..8" sub-headers ──────────────────────────────────────
  ws.getRow(4).height = 11
  days.forEach((day, di) => {
    const fill = day.isWeekend ? FILLS.WKD : FILLS.HDRD
    for (let ei = 0; ei < N_ENG; ei++) {
      const c = ws.getCell(4, dayEngCol(di, ei))
      c.value = `Eng ${ei + 1}`
      style(c, { fill, font: { bold: true, size: 6, color: { argb: 'FF000000' } } })
    }
  })

  // ── Data rows: one per 30-min slot ─────────────────────────────────────
  ALL_SLOTS.forEach((slot, ri) => {
    const row    = 5 + ri
    const isHour = slot % 60 === 0
    ws.getRow(row).height = isHour ? 10 : 8

    const ist  = fmtMins(slot)
    const est  = fmtMins((slot - EST_OFF + 2880) % 1440)
    const pst  = fmtMins((slot - PST_OFF + 2880) % 1440)
    const estd = dateLbl(slot, EST_OFF)
    const pstd = dateLbl(slot, PST_OFF)
    const altFill = ri % 2 === 0 ? FILLS.ALT : FILLS.WHITE

    function tzCol(col, val, fill, color, bold = false) {
      const c = ws.getCell(row, col)
      c.value = val
      style(c, { fill, font: { size: 6.5, color: { argb: 'FF' + color }, bold } })
    }

    tzCol(COL_EST_L,  est,  FILLS.EST, C.TEAL)
    tzCol(COL_ESTD_L, estd, FILLS.EST, C.TEAL)
    tzCol(COL_PST_L,  pst,  FILLS.PST, C.PURP2)
    tzCol(COL_PSTD_L, pstd, FILLS.PST, C.PURP2)
    tzCol(COL_IST_L,  ist,  FILLS.IST, C.BLUE, isHour)

    // Day sub-columns: find active engineers, map to Eng 1..N_ENG slots
    days.forEach((day, di) => {
      const daySchedule = schedule[day.id] || {}
      const dayFill = day.isWeekend ? FILLS.WKD : altFill

      // Get engineers active at this slot for this day
      const activeEngs = engineers
        .map(eng => {
          const entry = daySchedule[eng.id]
          if (!entry || entry.status !== 'WORKING') return null
          const s = parseMins(entry.startTime)
          const e = parseMins(entry.endTime)
          const active = e > s ? (slot >= s && slot < e) : (slot >= s || slot < e)
          if (!active) return null
          return {
            name:    eng.name,
            isStart: slot === s,
            isOC:    entry.isOnCall,
          }
        })
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name))

      for (let ei = 0; ei < N_ENG; ei++) {
        const c = ws.getCell(row, dayEngCol(di, ei))
        c.fill = dayFill
        style(c, { fill: dayFill, font: { size: 6.5, color: { argb: 'FF' + C.BLACK } } })

        if (ei < activeEngs.length) {
          const eng = activeEngs[ei]
          let color = C.BLACK
          if (eng.isStart) color = C.GREEN
          c.value = eng.isOC ? `${eng.name}(OC)` : eng.name
          c.font  = { name: 'Calibri', size: 6.5, bold: eng.isStart,
                      color: { argb: 'FF' + color } }
        }
      }
    })

    tzCol(COL_IST_R,  ist,  FILLS.IST, C.BLUE, isHour)
    tzCol(COL_PST_R,  pst,  FILLS.PST, C.PURP2)
    tzCol(COL_PSTD_R, pstd, FILLS.PST, C.PURP2)
    tzCol(COL_EST_R,  est,  FILLS.EST, C.TEAL)
    tzCol(COL_ESTD_R, estd, FILLS.EST, C.TEAL)
  })

  // Footer
  ws.headerFooter.oddFooter = `&L${weekLabel}&C EST    PST    ${days.map(d=>d.short).join('    ')}    PST    EST`

  // ── Sheet 2: Engineer Summary ──────────────────────────────────────────
  const ws2 = wb.addWorksheet('Engineer Summary', {
    pageSetup: { orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1 }
  })

  const sumCols = ['Engineer','Shift','Working','Weekly Off','Annual Leave',
                   'Comp Off','Sick Leave','Public Hol','On Call Days']
  const sumWidths = [16,14,12,12,14,12,12,12,13]
  ws2.columns = sumCols.map((h, i) => ({ header: h, width: sumWidths[i] }))

  // Style header row
  ws2.getRow(1).height = 18
  ws2.getRow(1).eachCell(cell => {
    style(cell, {
      fill: FILLS.HDR,
      font: { bold: true, size: 9, color: { argb: 'FFFFFFFF' } },
    })
  })

  engineers.forEach((eng, i) => {
    const counts = {}
    let onCallDays = 0
    days.forEach(day => {
      const entry = schedule[day.id]?.[eng.id]
      if (!entry) return
      counts[entry.status] = (counts[entry.status] || 0) + 1
      if (entry.isOnCall) onCallDays++
    })

    const rowData = [
      eng.name, eng.shift,
      counts.WORKING || 0, counts.WEEKLY_OFF || 0, counts.ANNUAL_LEAVE || 0,
      counts.COMP_OFF || 0, counts.SICK_LEAVE || 0, counts.PUBLIC_HOL || 0,
      onCallDays,
    ]

    const r = ws2.addRow(rowData)
    r.height = 15
    const fill = i % 2 === 0 ? FILLS.SUM : FILLS.WHITE
    r.eachCell((cell, ci) => {
      style(cell, {
        fill,
        font: { size: 9, bold: ci === 1 },
        align: ci === 1 ? 'left' : 'center',
      })
    })
  })

  // ── Save ────────────────────────────────────────────────────────────────
  const buf  = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const filename = `roster-${weekLabel.replace(/\s+/g, '-').toLowerCase()}.xlsx`
  saveAs(blob, filename)
}
