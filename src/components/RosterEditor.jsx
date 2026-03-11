import React, { useState } from 'react'
import { useRosterStore, STATUSES, SHIFTS } from '../store/rosterStore.js'
import { convertTime } from '../utils/timezone.js'

const TIME_OPTIONS = [
  '12:00 AM','12:30 AM','1:00 AM','1:30 AM','2:00 AM','2:30 AM','3:00 AM','3:30 AM',
  '4:00 AM','4:30 AM','5:00 AM','5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM',
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM',
  '8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM',
]

export default function RosterEditor({ timezone }) {
  const { engineers, activeWeekId, weeks, updateScheduleEntry } = useRosterStore()
  const activeWeek = weeks?.[activeWeekId]
  const days       = activeWeek?.days     || []
  const schedule   = activeWeek?.schedule || {}

  const [editing,   setEditing]   = useState(null)
  const [filterEng, setFilterEng] = useState('')
  const [applyDays, setApplyDays] = useState([])
  const [applied,   setApplied]   = useState(false)

  const filtered   = engineers.filter(e => e.name.toLowerCase().includes(filterEng.toLowerCase()))
  const entry      = editing ? schedule[editing.engId]?.[editing.dayId] : null
  const editingEng = editing ? engineers.find(e => e.id === editing.engId) : null
  const editingDay = editing ? days.find(d => d.id === editing.dayId) : null

  function update(field, value) {
    updateScheduleEntry(editing.engId, editing.dayId, { [field]: value })
  }

  function applyToSelectedDays() {
    const current = schedule[editing.engId]?.[editing.dayId]
    if (!current) return
    applyDays.forEach(dayId => {
      if (dayId === editing.dayId) return
      updateScheduleEntry(editing.engId, dayId, {
        status:     current.status,
        startTime:  current.startTime,
        endTime:    current.endTime,
        isSplit:    current.isSplit,
        startTime2: current.startTime2,
        endTime2:   current.endTime2,
        isOnCall:   current.isOnCall,
      })
    })
    setApplied(true)
    setTimeout(() => setApplied(false), 2000)
  }

  function toggleApplyDay(dayId) {
    setApplyDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId])
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Roster Editor</h1>
        <p className="page-subtitle">Click any cell to edit status, times, on-call and notes</p>
      </div>

      <div className="page-card no-pad">
        {/* TOOLBAR */}
        <div className="editor-toolbar">
          <div className="editor-legend">
            {Object.entries(STATUSES).map(([key, s]) => (
              <span key={key} className="legend-pill" style={{ background: s.bg, color: s.color }}>
                <span className="legend-dot" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
          <input
            className="search-input"
            placeholder="Search engineer..."
            value={filterEng}
            onChange={e => setFilterEng(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="editor-grid-wrap">
          <table className="editor-grid">
            <thead>
              <tr>
                <th className="col-eng-hdr">Engineer</th>
                {days.map(day => (
                  <th key={day.id} className={day.isWeekend ? 'col-day-hdr weekend-hdr' : 'col-day-hdr'}>
                    <div>{day.short}</div>
                    <div className="day-date-small">{day.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((eng, idx) => (
                <tr key={eng.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td className="cell-eng-name">
                    <div className="eng-name">{eng.name}</div>
                    <span className="shift-badge-sm" style={{ background: SHIFTS[eng.shift]?.bg, color: SHIFTS[eng.shift]?.color }}>
                      {SHIFTS[eng.shift]?.label}
                    </span>
                  </td>
                  {days.map(day => {
                    const e = schedule[eng.id]?.[day.id]
                    if (!e) return <td key={day.id} />
                    const st       = STATUSES[e.status]
                    const isActive = editing?.engId === eng.id && editing?.dayId === day.id
                    const s  = e.status === 'WORKING' ? convertTime(e.startTime, timezone) : null
                    const en = e.status === 'WORKING' ? convertTime(e.endTime,   timezone) : null
                    return (
                      <td
                        key={day.id}
                        className={`cell-editable${day.isWeekend ? ' weekend-cell' : ''}${isActive ? ' cell-active' : ''}`}
                        onClick={() => { setEditing({ engId: eng.id, dayId: day.id }); setApplyDays([]); setApplied(false) }}
                      >
                        <div className="edit-chip" style={{ background: st.bg, color: st.color }}>
                          {st.label}
                          {e.isOnCall && <span className="oc-dot"> OC</span>}
                        </div>
                        {s && <div className="edit-time">{s.time}<span className="arrow"> → </span>{en.time}</div>}
                        {e.isSplit && e.startTime2 && (
                          <div className="edit-time split-time-badge">
                            {convertTime(e.startTime2, timezone).time}<span className="arrow"> → </span>{convertTime(e.endTime2, timezone).time}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE PANEL */}
      {editing && entry && (
        <div className="edit-panel-overlay" onClick={() => setEditing(null)}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <div>
                <h3>Edit Entry</h3>
                <p className="panel-sub">{editingEng?.name} — {editingDay?.label} {editingDay?.date}</p>
              </div>
              <button className="close-btn" onClick={() => setEditing(null)}>✕</button>
            </div>

            {/* STATUS */}
            <div className="panel-section">
              <label className="panel-label">Status</label>
              <div className="status-grid">
                {Object.entries(STATUSES).map(([key, s]) => (
                  <button
                    key={key}
                    className={`status-option${entry.status === key ? ' status-selected' : ''}`}
                    style={{
                      background:  entry.status === key ? s.bg      : '#f9fafb',
                      color:       entry.status === key ? s.color   : '#374151',
                      borderColor: entry.status === key ? s.color   : '#d1d5db',
                    }}
                    onClick={() => update('status', key)}
                  >
                    <span className="status-opt-label">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SHIFT */}
            <div className="panel-section">
              <label className="panel-label">Shift Type</label>
              <div className="shift-options">
                {Object.entries(SHIFTS).map(([key, sh]) => (
                  <button
                    key={key}
                    className={`shift-option${entry.shift === key ? ' shift-selected' : ''}`}
                    style={{
                      background:  entry.shift === key ? sh.bg    : '#f9fafb',
                      color:       entry.shift === key ? sh.color : '#374151',
                      borderColor: entry.shift === key ? sh.color : '#d1d5db',
                    }}
                    onClick={() => update('shift', key)}
                  >{sh.label}</button>
                ))}
              </div>
            </div>

            {/* TIMES */}
            {entry.status === 'WORKING' && (
              <div className="panel-section">
                <label className="panel-label">Shift Times (IST)</label>
                <div className="time-row">
                  <div className="time-field">
                    <label>Start</label>
                    <select value={entry.startTime} onChange={e => update('startTime', e.target.value)}>
                      {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <span className="time-arrow">→</span>
                  <div className="time-field">
                    <label>End</label>
                    <select value={entry.endTime} onChange={e => update('endTime', e.target.value)}>
                      {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                {timezone !== 'IST' && (
                  <p className="tz-convert-note">
                    In {timezone}: {convertTime(entry.startTime, timezone).time} → {convertTime(entry.endTime, timezone).time}
                  </p>
                )}

                {/* SPLIT SHIFT */}
                <div className="split-toggle-row">
                  <button
                    className={`split-toggle-btn${entry.isSplit ? ' split-toggle-on' : ''}`}
                    onClick={() => {
                      if (!entry.isSplit) {
                        updateScheduleEntry(editing.engId, editing.dayId, {
                          isSplit: true,
                          startTime2: entry.startTime2 || '7:00 PM',
                          endTime2: entry.endTime2 || '10:00 PM',
                        })
                      } else {
                        updateScheduleEntry(editing.engId, editing.dayId, {
                          isSplit: false, startTime2: null, endTime2: null,
                        })
                      }
                    }}
                  >
                    {entry.isSplit ? '✕ Remove Split Shift' : '＋ Add Split Shift'}
                  </button>
                </div>
                {entry.isSplit && (
                  <>
                    <div className="split-label">2nd Shift (IST)</div>
                    <div className="time-row">
                      <div className="time-field">
                        <label>Start</label>
                        <select value={entry.startTime2 || '7:00 PM'} onChange={e => update('startTime2', e.target.value)}>
                          {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <span className="time-arrow">→</span>
                      <div className="time-field">
                        <label>End</label>
                        <select value={entry.endTime2 || '10:00 PM'} onChange={e => update('endTime2', e.target.value)}>
                          {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    {timezone !== 'IST' && entry.startTime2 && (
                      <p className="tz-convert-note">
                        In {timezone}: {convertTime(entry.startTime2, timezone).time} → {convertTime(entry.endTime2, timezone).time}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ON CALL */}
            <div className="panel-section">
              <label className="panel-label">On Call</label>
              <button
                className={`toggle-btn${entry.isOnCall ? ' toggle-on' : ''}`}
                onClick={() => update('isOnCall', !entry.isOnCall)}
              >
                {entry.isOnCall ? 'On Call — ON' : 'On Call — OFF'}
              </button>
            </div>

            {/* NOTES */}
            <div className="panel-section">
              <label className="panel-label">Notes</label>
              <textarea
                className="notes-input"
                placeholder="Add any notes..."
                value={entry.notes}
                onChange={e => update('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* APPLY TO DAYS */}
            <div className="panel-section apply-days-section">
              <label className="panel-label">Apply to other days</label>
              <div className="apply-days-grid">
                {days.map(day => {
                  const isCurrent = day.id === editing?.dayId
                  const isSelected = applyDays.includes(day.id)
                  return (
                    <button
                      key={day.id}
                      disabled={isCurrent}
                      className={`apply-day-btn${isSelected ? ' apply-day-on' : ''}${isCurrent ? ' apply-day-current' : ''}${day.isWeekend ? ' apply-day-weekend' : ''}`}
                      onClick={() => toggleApplyDay(day.id)}
                    >
                      <div className="apply-day-name">{day.short}</div>
                      <div className="apply-day-date">{day.date}</div>
                    </button>
                  )
                })}
              </div>
              <div className="apply-row">
                <button className="apply-quick-btn" onClick={() => setApplyDays(days.filter(d => !d.isWeekend && d.id !== editing?.dayId).map(d => d.id))}>Weekdays</button>
                <button className="apply-quick-btn" onClick={() => setApplyDays(days.filter(d => d.isWeekend && d.id !== editing?.dayId).map(d => d.id))}>Weekends</button>
                <button className="apply-quick-btn" onClick={() => setApplyDays(days.filter(d => d.id !== editing?.dayId).map(d => d.id))}>All Week</button>
                <button className="apply-quick-btn" onClick={() => setApplyDays([])}>Clear</button>
              </div>
              {applyDays.length > 0 && (
                <button className={`apply-confirm-btn${applied ? ' apply-done' : ''}`} onClick={applyToSelectedDays}>
                  {applied ? '✓ Applied!' : `Apply to ${applyDays.length} day${applyDays.length > 1 ? 's' : ''}`}
                </button>
              )}
            </div>

            <button className="done-btn" onClick={() => setEditing(null)}>Done</button>
          </div>
        </div>
      )}
    </div>
  )
}