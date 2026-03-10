import React, { useState, useEffect, useMemo } from 'react'
import { loadSnapshot } from '../utils/supabase.js'

const STATUSES = {
  WORKING:      { label: 'Working',        color: '#16a34a', bg: '#dcfce7' },
  WEEKLY_OFF:   { label: 'Weekly Off',     color: '#0891b2', bg: '#cffafe' },
  ANNUAL_LEAVE: { label: 'Annual Leave',   color: '#dc2626', bg: '#fee2e2' },
  COMP_OFF:     { label: 'Comp Off',       color: '#db2777', bg: '#fce7f3' },
  SICK_LEAVE:   { label: 'Sick Leave',     color: '#d97706', bg: '#fef3c7' },
  PUBLIC_HOL:   { label: 'Public Holiday', color: '#7c3aed', bg: '#ede9fe' },
}

const SHIFTS = {
  Night:     { label: 'Night',     color: '#3730a3', bg: '#e0e7ff' },
  Morning:   { label: 'Morning',   color: '#065f46', bg: '#d1fae5' },
  Afternoon: { label: 'Afternoon', color: '#92400e', bg: '#fef3c7' },
  Evening:   { label: 'Evening',   color: '#7c2d12', bg: '#ffedd5' },
}

const TZ_INFO = {
  IST: { name: 'India Standard Time',   utc: 'UTC +5:30', offsetMins: 0   },
  EST: { name: 'Eastern Standard Time', utc: 'UTC −5:00', offsetMins: 630 },
  PST: { name: 'Pacific Standard Time', utc: 'UTC −8:00', offsetMins: 810 },
}

function parseTimeToMins(str) {
  if (!str) return 0
  const [time, ampm] = str.trim().split(' ')
  let [h, m] = time.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function convertTime(istStr, tz) {
  if (!istStr || tz === 'IST') return istStr || '—'
  const offset = TZ_INFO[tz].offsetMins
  const mins   = parseTimeToMins(istStr)
  const result = ((mins - offset) + 4320) % 1440
  const h = Math.floor(result / 60), m = result % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${m.toString().padStart(2,'0')} ${ampm}`
}

// ── Loading screen ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f766e,#134e4a)', gap:20 }}>
      <div style={{
        width:48, height:48, borderRadius:'50%',
        border:'4px solid rgba(255,255,255,0.2)',
        borderTopColor:'#5eead4',
        animation:'spin 0.8s linear infinite',
      }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:'rgba(255,255,255,0.8)', fontSize:15, fontWeight:500 }}>Loading roster…</p>
    </div>
  )
}

// ── Error screen ───────────────────────────────────────────────────────────
function ErrorScreen({ message }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f766e,#134e4a)' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'48px 40px', textAlign:'center', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:24, color:'#dc2626' }}>!</div>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:8 }}>Link Not Found</h2>
        <p style={{ color:'#6b7280', lineHeight:1.6 }}>{message || 'This roster link is invalid or has expired. Ask your manager to generate a new one.'}</p>
      </div>
    </div>
  )
}

// ── Main view ──────────────────────────────────────────────────────────────
export default function RosterView() {
  const [timezone, setTimezone]   = useState('IST')
  const [snapshot, setSnapshot]   = useState(null)
  const [loading,  setLoading]    = useState(true)
  const [error,    setError]      = useState(null)

  // Extract ID from hash: /#/view/SOME-ID
  const snapshotId = useMemo(() => {
    const hash = window.location.hash  // "#/view/abc123"
    const id = hash.split('#/view/')[1]
    return id || null
  }, [])

  useEffect(() => {
    if (!snapshotId) {
      setError('No snapshot ID found in this link.')
      setLoading(false)
      return
    }
    loadSnapshot(snapshotId).then(data => {
      if (!data) setError('Snapshot not found. It may have expired or the link is incorrect.')
      else setSnapshot(data)
      setLoading(false)
    }).catch(() => {
      setError('Failed to load the roster. Please try again.')
      setLoading(false)
    })
  }, [snapshotId])

  if (loading)        return <LoadingScreen />
  if (error || !snapshot) return <ErrorScreen message={error} />

  const { weekLabel, generatedAt, days, engineers, schedule } = snapshot
  const tzInfo  = TZ_INFO[timezone]
  const genDate = new Date(generatedAt).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })

  const stats = (() => {
    let working=0, leave=0, onCall=0, weeklyOff=0
    engineers.forEach(eng => days.forEach(day => {
      const e = schedule[eng.id]?.[day.id]
      if (!e) return
      if (e.status==='WORKING') working++
      if (['ANNUAL_LEAVE','SICK_LEAVE','COMP_OFF'].includes(e.status)) leave++
      if (e.status==='WEEKLY_OFF') weeklyOff++
      if (e.isOnCall) onCall++
    }))
    return { working, leave, onCall, weeklyOff }
  })()

  const R = { display:'flex', alignItems:'center' }

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf8', fontFamily:'Inter,system-ui,sans-serif' }}>

      {/* ── TOPBAR ── */}
      <header style={{ background:'linear-gradient(135deg,#0f766e 0%,#134e4a 100%)', boxShadow:'0 2px 20px rgba(0,0,0,0.15)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1440, margin:'0 auto', padding:'0 28px', height:64, ...R, gap:20 }}>

          {/* Brand */}
          <div style={{ ...R, gap:10, flexShrink:0 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#5eead4,#2dd4bf)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18M16 2v4M8 2v4M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.2 }}>Roster Management</div>
              <div style={{ fontSize:11, color:'rgba(153,246,228,0.65)' }}>Global Shift Planning</div>
            </div>
          </div>

          {/* Week */}
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#fff', letterSpacing:'-0.02em' }}>{weekLabel}</div>
            <div style={{ fontSize:11, color:'rgba(153,246,228,0.6)', marginTop:2 }}>Snapshot · {genDate}</div>
          </div>

          {/* TZ switcher */}
          <div style={{ ...R, gap:10, flexShrink:0 }}>
            <span style={{ fontSize:12, color:'rgba(153,246,228,0.7)', fontWeight:500 }}>Timezone</span>
            <div style={{ ...R, background:'rgba(0,0,0,0.25)', borderRadius:8, padding:3, gap:2 }}>
              {['IST','EST','PST'].map(tz => (
                <button key={tz} onClick={() => setTimezone(tz)} style={{
                  padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer',
                  fontSize:12, fontWeight:700, transition:'all 0.15s',
                  background: timezone===tz ? '#fff' : 'transparent',
                  color: timezone===tz ? '#0f766e' : 'rgba(255,255,255,0.65)',
                  boxShadow: timezone===tz ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                }}>{tz}</button>
              ))}
            </div>
            <div style={{ fontSize:11, lineHeight:1.4 }}>
              <div style={{ color:'rgba(153,246,228,0.85)', fontWeight:600 }}>{tzInfo.name}</div>
              <div style={{ color:'rgba(153,246,228,0.5)' }}>{tzInfo.utc}</div>
            </div>
          </div>

          {/* Read-only badge */}
          <div style={{ ...R, gap:5, background:'rgba(255,255,255,0.1)', borderRadius:20, padding:'4px 10px', flexShrink:0 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"><path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>Read Only</span>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth:1440, margin:'0 auto', padding:'24px 28px 80px' }}>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:20 }}>
          {[
            { label:'Engineers', value:engineers.length, color:'#0891b2', bg:'#e0f2fe' },
            { label:'Working',   value:stats.working,   color:'#16a34a', bg:'#dcfce7' },
            { label:'On Leave',  value:stats.leave,     color:'#dc2626', bg:'#fee2e2' },
            { label:'Weekly Off',value:stats.weeklyOff, color:'#0d9488', bg:'#ccfbf1' },
            { label:'On Call',   value:stats.onCall,    color:'#7c3aed', bg:'#ede9fe' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'16px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #e5e7eb', ...R, gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18, fontWeight:800 }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#6b7280', fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TZ banner */}
        <div style={{ background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', border:'1px solid #a7f3d0', borderRadius:10, padding:'9px 16px', ...R, gap:8, marginBottom:18 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span style={{ fontSize:13, color:'#065f46', fontWeight:500 }}>
            Showing times in <strong>{timezone}</strong> — {tzInfo.name} ({tzInfo.utc})
          </span>
          <span style={{ marginLeft:'auto', fontSize:11, color:'#6b7280' }}>Toggle IST / EST / PST in the header</span>
        </div>

        {/* Roster Table */}
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e5e7eb', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>
                  <th style={{ background:'linear-gradient(135deg,#0f766e,#134e4a)', color:'#fff', padding:'11px 16px', textAlign:'left', fontWeight:600, fontSize:12, whiteSpace:'nowrap', borderRight:'1px solid rgba(255,255,255,0.1)', minWidth:160, position:'sticky', left:0, zIndex:2 }}>
                    Engineer
                  </th>
                  <th style={{ background:'linear-gradient(135deg,#0f766e,#134e4a)', color:'#fff', padding:'11px 14px', textAlign:'left', fontWeight:600, fontSize:12, whiteSpace:'nowrap', borderRight:'1px solid rgba(255,255,255,0.1)', minWidth:90 }}>
                    Shift
                  </th>
                  {days.map(day => (
                    <th key={day.id} style={{
                      background: day.isWeekend ? 'linear-gradient(135deg,#064e3b,#052e16)' : 'linear-gradient(135deg,#0f766e,#134e4a)',
                      color:'#fff', padding:'9px 10px', textAlign:'center', fontWeight:600, fontSize:11, minWidth:116,
                      borderRight:'1px solid rgba(255,255,255,0.08)',
                    }}>
                      <div style={{ fontWeight:700 }}>{day.short}</div>
                      <div style={{ fontSize:10, opacity:0.6, marginTop:2 }}>{day.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {engineers.map((eng, idx) => (
                  <tr key={eng.id}
                    style={{ background: idx%2===0 ? '#fff' : '#f0fdf9' }}
                    onMouseEnter={e => e.currentTarget.style.background='#ecfdf5'}
                    onMouseLeave={e => e.currentTarget.style.background= idx%2===0 ? '#fff' : '#f0fdf9'}
                  >
                    <td style={{ padding:'9px 14px', borderBottom:'1px solid #f3f4f6', borderRight:'1px solid #f3f4f6', verticalAlign:'middle', position:'sticky', left:0, background:idx%2===0?'#fff':'#f0fdf9', zIndex:1 }}>
                      <div style={{ ...R, gap:9 }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#0d9488,#0f766e)', color:'#fff', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{eng.name[0]}</div>
                        <div>
                          <div style={{ fontWeight:600, color:'#111827', fontSize:13 }}>{eng.name}</div>
                          <div style={{ fontSize:10, color:'#9ca3af' }}>{eng.role||'Engineer'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'9px 12px', borderBottom:'1px solid #f3f4f6', borderRight:'1px solid #f3f4f6', verticalAlign:'middle' }}>
                      <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:SHIFTS[eng.shift]?.bg||'#f3f4f6', color:SHIFTS[eng.shift]?.color||'#374151' }}>
                        {SHIFTS[eng.shift]?.label||eng.shift}
                      </span>
                    </td>
                    {days.map(day => {
                      const entry = schedule?.[eng.id]?.[day.id]
                      const wknd  = day.isWeekend
                      if (!entry) return <td key={day.id} style={{ padding:8, borderBottom:'1px solid #f3f4f6', borderRight:'1px solid #f3f4f6', background:wknd?'rgba(204,251,241,0.12)':undefined }} />
                      const st = STATUSES[entry.status] || STATUSES.WORKING
                      const isW = entry.status==='WORKING'
                      const s0  = isW ? convertTime(entry.startTime, timezone) : null
                      const s1  = isW ? convertTime(entry.endTime,   timezone) : null
                      return (
                        <td key={day.id} style={{ padding:'7px 9px', borderBottom:'1px solid #f3f4f6', borderRight:'1px solid #f3f4f6', verticalAlign:'top', background:wknd?'rgba(204,251,241,0.12)':undefined }}>
                          <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:st.bg, color:st.color, fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:12, whiteSpace:'nowrap', marginBottom:3 }}>
                            {st.label}
                            {entry.isOnCall && <span style={{ background:'#7c3aed', color:'#fff', fontSize:8, fontWeight:700, padding:'1px 4px', borderRadius:5, marginLeft:2 }}>OC</span>}
                          </div>
                          {isW && s0 && (
                            <div style={{ fontSize:11, color:'#374151', fontWeight:500, display:'flex', alignItems:'center', gap:3 }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2"/></svg>
                              {s0} – {s1}
                            </div>
                          )}
                          {entry.notes && <div style={{ fontSize:10, color:'#9ca3af', marginTop:2, fontStyle:'italic' }}>{entry.notes}</div>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:18, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#6b7280', fontWeight:500, marginRight:4 }}>Legend:</span>
          {Object.entries(STATUSES).map(([k,s]) => (
            <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:5, background:s.bg, color:s.color, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:s.color }} />{s.label}
            </span>
          ))}
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'#ede9fe', color:'#7c3aed', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>
            <span style={{ background:'#7c3aed', color:'#fff', fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:6 }}>OC</span>On Call
          </span>
        </div>

        {/* Footer */}
        <div style={{ marginTop:20, textAlign:'center', fontSize:12, color:'#9ca3af', padding:'12px 20px', background:'#fff', borderRadius:8, border:'1px solid #f3f4f6' }}>
          🔒 Read-only view · Times in <strong>{timezone}</strong> ({tzInfo.utc}) · Snapshot {genDate} · Contact your manager to make changes
        </div>
      </main>
    </div>
  )
}
