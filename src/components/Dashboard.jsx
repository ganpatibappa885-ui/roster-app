import React, { useMemo } from 'react'
import { useRosterStore, STATUSES, SHIFTS } from '../store/rosterStore.js'
import { convertTime, TZ_INFO } from '../utils/timezone.js'

export default function Dashboard({ timezone }) {
  const { engineers, activeWeekId, weeks } = useRosterStore()
  const activeWeek = weeks?.[activeWeekId]
  const days       = activeWeek?.days     || []
  const schedule   = activeWeek?.schedule || {}
  const weekLabel  = activeWeek?.weekLabel || ''
  const tzInfo     = TZ_INFO[timezone]

  const totalWorking = engineers.reduce((acc, eng) =>
    acc + days.filter(d => schedule[eng.id]?.[d.id]?.status === 'WORKING').length, 0)
  const totalWO = engineers.reduce((acc, eng) =>
    acc + days.filter(d => schedule[eng.id]?.[d.id]?.status === 'WEEKLY_OFF').length, 0)
  const totalLeave = engineers.reduce((acc, eng) =>
    acc + days.filter(d => ['ANNUAL_LEAVE','SICK_LEAVE','COMP_OFF'].includes(schedule[eng.id]?.[d.id]?.status)).length, 0)
  const totalOnCall = engineers.reduce((acc, eng) =>
    acc + days.filter(d => schedule[eng.id]?.[d.id]?.isOnCall).length, 0)

  const daySummary = useMemo(() => days.map(day => {
    const counts = {}
    Object.keys(STATUSES).forEach(s => counts[s] = 0)
    engineers.forEach(eng => {
      const e = schedule?.[eng.id]?.[day.id]
      if (e) counts[e.status] = (counts[e.status] || 0) + 1
    })
    return { day, counts }
  }), [engineers, schedule, days])

  return (
    <div className="page-container dash-page">
      {/* DASHBOARD HERO */}
      <header className="dash-hero">
        <div className="dash-hero-main">
          <h1 className="dash-title">{weekLabel}</h1>
          <p className="dash-subtitle">
            Showing times in <strong>{timezone}</strong> — {tzInfo?.name} ({tzInfo?.utc})
          </p>
        </div>
        <div className="dash-stats">
          <div className="stat-card">
            <span className="stat-num">{engineers.length}</span>
            <span className="stat-lbl">Engineers</span>
          </div>
          <div className="stat-card stat-working">
            <span className="stat-num">{totalWorking}</span>
            <span className="stat-lbl">Working</span>
          </div>
          <div className="stat-card stat-wo">
            <span className="stat-num">{totalWO}</span>
            <span className="stat-lbl">Weekly Off</span>
          </div>
          <div className="stat-card stat-leave">
            <span className="stat-num">{totalLeave}</span>
            <span className="stat-lbl">Leave</span>
          </div>
          <div className="stat-card stat-oncall">
            <span className="stat-num">{totalOnCall}</span>
            <span className="stat-lbl">On Call</span>
          </div>
        </div>
      </header>

      {/* STATUS LEGEND */}
      <nav className="status-legend" aria-label="Status legend">
        {Object.entries(STATUSES).map(([key, s]) => (
          <span key={key} className="legend-pill" style={{ background: s.bg, color: s.color }}>
            <span className="legend-dot" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </nav>

      {/* ROSTER GRID */}
      <div className="page-card no-pad">
        <div className="roster-grid-wrap">
          <table className="roster-grid">
            <thead>
              <tr>
                <th className="col-eng">Engineer</th>
                <th className="col-shift">Shift</th>
                {days.map(day => (
                  <th key={day.id} className={day.isWeekend ? 'col-day weekend-hdr' : 'col-day'}>
                    <div className="day-th-label">{day.short}</div>
                    <div className="day-th-date">{day.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {engineers.map((eng, idx) => (
                <tr key={eng.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td className="cell-name">
                    <div className="eng-avatar-sm">{eng.name[0]}</div>
                    <div>
                      <div className="eng-name">{eng.name}</div>
                      <div className="eng-role">{eng.role}</div>
                    </div>
                  </td>
                  <td className="cell-shift">
                    <span className="shift-badge" style={{ background: SHIFTS[eng.shift]?.bg, color: SHIFTS[eng.shift]?.color }}>
                      {SHIFTS[eng.shift]?.label || eng.shift}
                    </span>
                  </td>
                  {days.map(day => {
                    const entry = schedule?.[eng.id]?.[day.id]
                    if (!entry) return <td key={day.id} className={day.isWeekend ? 'cell-day weekend-cell' : 'cell-day'} />
                    const st        = STATUSES[entry.status]
                    const isWorking = entry.status === 'WORKING'
                    const s         = isWorking ? convertTime(entry.startTime, timezone) : null
                    const e         = isWorking ? convertTime(entry.endTime,   timezone) : null
                    return (
                      <td key={day.id} className={`cell-day${day.isWeekend ? ' weekend-cell' : ''}`}>
                        <div className="day-status-chip" style={{ background: st.bg, color: st.color }}>
                          {st.label}
                          {entry.isOnCall && <span className="oc-badge">OC</span>}
                        </div>
                        {isWorking && s && (
                          <div className="time-range">
                            {s.time}{s.note && <span className="tz-note"> {s.note}</span>}
                            <span className="time-sep"> → </span>
                            {e.time}{e.note && <span className="tz-note"> {e.note}</span>}
                          </div>
                        )}
                        {entry.notes && <div className="entry-notes">{entry.notes}</div>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DAILY COVERAGE CARDS */}
      <h2 className="section-title">Daily Coverage Summary</h2>
      <div className="day-summary-cards">
        {daySummary.map(({ day, counts }) => (
          <div key={day.id} className={`day-card${day.isWeekend ? ' day-card-weekend' : ''}`}>
            <div className="day-card-header">
              <span className="day-card-name">{day.label}</span>
              <span className="day-card-date">{day.date}</span>
            </div>
            <div className="day-card-body">
              {Object.entries(STATUSES).map(([key, s]) =>
                counts[key] > 0 && (
                  <div key={key} className="day-count-row">
                    <span style={{ color: s.color }}>{s.label}</span>
                    <span className="day-count-num" style={{ background: s.bg, color: s.color }}>{counts[key]}</span>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
