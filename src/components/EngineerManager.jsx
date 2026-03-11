import React, { useState } from 'react'
import { useRosterStore, SHIFTS } from '../store/rosterStore.js'

export default function EngineerManager() {
  const { engineers, activeWeekId, weeks, addEngineer, removeEngineer, updateEngineer, updateWeekLabel, resetToDefaults } = useRosterStore()
  const activeWeek = weeks?.[activeWeekId]
  const weekLabel  = activeWeek?.weekLabel || ''

  const [form, setForm]       = useState({ name: '', role: 'Engineer', shift: 'Morning' })
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  function handleAdd() {
    if (!form.name.trim()) return
    addEngineer(form)
    setForm({ name: '', role: 'Engineer', shift: 'Morning' })
  }

  function handleRemove(id) {
    removeEngineer(id)
    setConfirm(null)
  }

  function handleUpdate(id) {
    updateEngineer(id, editing)
    setEditing(null)
  }

  return (
    <div className="page-container team-page">

      {/* HERO HEADER */}
      <header className="team-hero">
        <div className="team-hero-main">
          <h1 className="team-title">Team Management</h1>
          <p className="team-subtitle">Add, edit, or remove team members. Changes apply across all weeks.</p>
        </div>
        <button className="btn-danger-sm" onClick={() => setConfirm('reset')}>Reset to Defaults</button>
      </header>

      {/* WEEK LABEL + ADD ENGINEER */}
      <div className="team-actions-grid">
        <div className="page-card team-card">
          <div className="team-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
          <h2 className="team-card-title">Week Label</h2>
          <p className="team-card-desc">Used in exports and headers</p>
          <input
            className="week-label-input"
            value={weekLabel}
            onChange={e => updateWeekLabel(activeWeekId, e.target.value)}
            placeholder="e.g. Week Ending 1 March 2026"
          />
        </div>

        <div className="page-card team-card team-card-add">
          <div className="team-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </div>
          <h2 className="team-card-title">Add Engineer</h2>
          <div className="add-form">
            <input
              className="form-input"
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <input
              className="form-input"
              placeholder="Role"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            />
            <select
              className="form-select"
              value={form.shift}
              onChange={e => setForm(f => ({ ...f, shift: e.target.value }))}
            >
              {Object.entries(SHIFTS).map(([key, sh]) => (
                <option key={key} value={key}>{sh.label}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={handleAdd} disabled={!form.name.trim()}>
              Add Engineer
            </button>
          </div>
        </div>
      </div>

      {/* ENGINEER LIST TABLE */}
      <div className="page-card team-table-card no-pad">
        <div className="team-table-header">
          <h2 className="team-table-title">Team Members</h2>
          <span className="team-table-count">{engineers.length}</span>
        </div>
        <div style={{overflowX:'auto', WebkitOverflowScrolling:'touch'}}>
        <div className="eng-list">
          <div className="eng-list-header">
            <span className="eng-col-name">Member</span>
            <span className="eng-col-shift">Shift</span>
            <span className="eng-col-actions">Actions</span>
          </div>
          {engineers.map((eng, idx) => (
            <div key={eng.id} className={`eng-list-row${idx % 2 === 0 ? ' eng-row-even' : ' eng-row-odd'}`}>
              <div className="eng-cell-member">
                <div className="eng-avatar">{eng.name[0]}</div>
                {editing?.id === eng.id ? (
                  <div className="eng-edit-form">
                    <input
                      className="form-input-sm"
                      value={editing.name}
                      onChange={e => setEditing(ed => ({ ...ed, name: e.target.value }))}
                    />
                    <input
                      className="form-input-sm"
                      value={editing.role}
                      onChange={e => setEditing(ed => ({ ...ed, role: e.target.value }))}
                    />
                    <select
                      className="form-select-sm"
                      value={editing.shift}
                      onChange={e => setEditing(ed => ({ ...ed, shift: e.target.value }))}
                    >
                      {Object.entries(SHIFTS).map(([key, sh]) => (
                        <option key={key} value={key}>{sh.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="eng-info">
                    <span className="eng-name">{eng.name}</span>
                    <span className="eng-meta">{eng.role}</span>
                  </div>
                )}
              </div>
              <div className="eng-cell-shift">
                {editing?.id !== eng.id && (
                  <span className="shift-badge" style={{
                    background: SHIFTS[eng.shift]?.bg,
                    color: SHIFTS[eng.shift]?.color,
                  }}>
                    {SHIFTS[eng.shift]?.label || eng.shift}
                  </span>
                )}
              </div>
              <div className="eng-cell-actions">
                {editing?.id === eng.id ? (
                  <>
                    <button className="btn-save-sm" onClick={() => handleUpdate(eng.id)}>Save</button>
                    <button className="btn-cancel-sm" onClick={() => setEditing(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn-edit-sm" onClick={() => setEditing({ ...eng })}>Edit</button>
                    <button className="btn-remove-sm" onClick={() => setConfirm(eng.id)}>Remove</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* CONFIRM DIALOG */}
      {confirm && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {confirm === 'reset' ? (
              <>
                <h3>Reset to Defaults?</h3>
                <p>This will restore all 12 engineers and clear all saved data. This cannot be undone.</p>
                <div className="modal-actions">
                  <button className="btn-danger" onClick={resetToDefaults}>Reset Everything</button>
                  <button className="btn-secondary" onClick={() => setConfirm(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>Remove Engineer?</h3>
                <p>This will remove <strong>{engineers.find(e => e.id === confirm)?.name}</strong> from all weeks. This cannot be undone.</p>
                <div className="modal-actions">
                  <button className="btn-danger" onClick={() => handleRemove(confirm)}>Remove</button>
                  <button className="btn-secondary" onClick={() => setConfirm(null)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}