import React, { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import RosterEditor from './components/RosterEditor.jsx'
import EngineerManager from './components/EngineerManager.jsx'
import PDFExport from './components/PDFExport.jsx'
import RosterView from './components/RosterView.jsx'
import { useRosterStore } from './store/rosterStore.js'

const TABS = [
  { id: 'dashboard', label: 'Dashboard'  },
  { id: 'editor',    label: 'Roster'     },
  { id: 'engineers', label: 'Team'       },
  { id: 'export',    label: 'Publishing' },
]

export default function App() {
  if (window.location.hash.startsWith('#/view/')) return <RosterView />

  const [activeTab, setActiveTab] = useState('dashboard')
  const [timezone,  setTimezone]  = useState('IST')
  const { activeWeekId, weeks, createWeek, setActiveWeek } = useRosterStore()
  const weekLabel = weeks[activeWeekId]?.weekLabel || ''
  const weekIds = Object.keys(weeks).sort()
  const currentIndex = weekIds.indexOf(activeWeekId)

  function goToNextWeek() {
    const current = new Date(activeWeekId)
    current.setDate(current.getDate() + 7)
    const nextId = current.toISOString().slice(0, 10)
    if (!weeks[nextId]) createWeek(nextId)
    else setActiveWeek(nextId)
  }

  function goToPrevWeek() {
    const current = new Date(activeWeekId)
    current.setDate(current.getDate() - 7)
    const prevId = current.toISOString().slice(0, 10)
    if (weeks[prevId]) setActiveWeek(prevId)
  }

  return (
    <div className="app-container">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-dot" />
          <div className="brand-text">
            <h1 className="app-title">Roster Management</h1>
            <p className="app-subtitle">Global Shift Planning</p>
          </div>
        </div>
        <div className="topbar-controls">
          <div className="week-picker">
            <button className="week-picker-btn" onClick={goToPrevWeek} disabled={currentIndex <= 0} aria-label="Previous week">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="week-label">{weekLabel}</span>
            <button className="week-picker-btn" onClick={goToNextWeek} aria-label="Next week">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="topbar-divider" />
          <div className="tz-picker">
            <span className="tz-label">Timezone</span>
            <div className="tz-switcher">
              {['IST', 'EST', 'PST'].map(tz => (
                <button key={tz} className={`tz-btn${timezone === tz ? ' active' : ''}`} onClick={() => setTimezone(tz)}>{tz}</button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <nav className="tabnav">
        {TABS.map(tab => (
          <button key={tab.id} className={`tabnav-btn${activeTab === tab.id ? ' active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard timezone={timezone} />}
        {activeTab === 'editor'    && <RosterEditor timezone={timezone} />}
        {activeTab === 'engineers' && <EngineerManager />}
        {activeTab === 'export'    && <PDFExport timezone={timezone} />}
      </main>
    </div>
  )
}
