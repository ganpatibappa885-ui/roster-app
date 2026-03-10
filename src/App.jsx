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
  const mins   = parseTimeToMins(istStr)
  const result = ((mins - TZ_INFO[tz].offsetMins) + 4320) % 1440
  const h = Math.floor(result / 60), m = result % 60
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${m.toString().padStart(2,'0')} ${h < 12 ? 'AM' : 'PM'}`
}

function Spinner() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f766e,#134e4a)', gap:16 }}>
      <div style={{ width:44, height:44, borderRadius:'50%', border:'4px solid rgba(255,255,255,0.15)', borderTopColor:'#5eead4', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14 }}>Loading roster…</p>
    </div>
  )
}
function ErrorBox({ msg }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f766e,#134e4a)', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'40px 32px', textAlign:'center', maxWidth:400, width:'100%' }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:'#fee2e2', color:'#dc2626', fontSize:22, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>!</div>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:8 }}>Link Not Found</h2>
        <p style={{ color:'#6b7280', lineHeight:1.6, fontSize:14 }}>{msg || 'This roster link is invalid or expired.'}</p>
      </div>
    </div>
  )
}

export default function RosterView() {
  const [timezone, setTimezone] = useState('IST')
  const [snapshot, setSnapshot] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [mobile,   setMobile]   = useState(window.innerWidth <= 768)

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const snapshotId = useMemo(() => window.location.hash.split('#/view/')[1] || null, [])

  useEffect(() => {
    if (!snapshotId) { setError('No snapshot ID in this link.'); setLoading(false); return }
    loadSnapshot(snapshotId).then(data => {
      if (!data) setError('Snapshot not found or expired.')
      else setSnapshot(data)
      setLoading(false)
    }).catch(() => { setError('Failed to load roster.'); setLoading(false) })
  }, [snapshotId])

  if (loading)  return <Spinner />
  if (!snapshot || error) return <ErrorBox msg={error} />

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

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf8', fontFamily:'Inter,system-ui,sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        .rv-table { width:100%; border-collapse:collapse; font-size:13px; }
        .rv-table thead th { background:linear-gradient(135deg,#0f766e,#134e4a); color:#fff; padding:10px 10px; font-weight:600; font-size:11px; white-space:nowrap; border-right:1px solid rgba(255,255,255,0.08); }
        .rv-table thead th:first-child { position:sticky; left:0; z-index:3; min-width:130px; text-align:left; }
        .rv-table thead th:nth-child(2) { min-width:80px; text-align:left; }
        .rv-table thead th.day-col { min-width:110px; text-align:center; }
        .rv-table thead th.wknd { background:linear-gradient(135deg,#064e3b,#052e16) !important; }
        .rv-table tbody tr:nth-child(even) { background:#f0fdf9; }
        .rv-table tbody tr:nth-child(odd)  { background:#fff; }
        .rv-table tbody tr:hover { background:#ecfdf5; }
        .rv-table tbody td { padding:7px 9px; border-bottom:1px solid #f3f4f6; border-right:1px solid #f3f4f6; vertical-align:top; }
        .rv-table tbody td:first-child { position:sticky; left:0; z-index:1; background:inherit; min-width:130px; }
        .rv-table tbody td.wknd-cell { background:rgba(204,251,241,0.15) !important; }
        .rv-chip { display:inline-flex; align-items:center; gap:3px; font-size:10px; font-weight:600; padding:2px 7px; border-radius:12px; white-space:nowrap; margin-bottom:3px; }
        .rv-time { font-size:10px; color:#374151; font-weight:500; display:flex; align-items:center; gap:3px; }
        .rv-oc   { background:#7c3aed; color:#fff; font-size:8px; font-weight:700; padding:1px 4px; border-radius:5px; margin-left:2px; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        background:'linear-gradient(135deg,#0f766e,#134e4a)',
        position:'sticky', top:0, zIndex:100,
        boxShadow:'0 2px 16px rgba(0,0,0,0.15)',
      }}>
        {/* Top row: brand + week + readonly */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding: mobile ? '10px 14px 6px' : '0 28px', height: mobile ? 'auto' : 64 }}>
          {!mobile && (
            <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#5eead4,#2dd4bf)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18M16 2v4M8 2v4M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Roster Management</div>
                <div style={{ fontSize:10, color:'rgba(153,246,228,0.6)' }}>Global Shift Planning</div>
              </div>
            </div>
          )}
          <div style={{ flex:1, textAlign: mobile ? 'left' : 'center' }}>
            <div style={{ fontSize: mobile ? 13 : 15, fontWeight:700, color:'#fff', letterSpacing:'-0.02em' }}>{weekLabel}</div>
            {!mobile && <div style={{ fontSize:11, color:'rgba(153,246,228,0.55)', marginTop:2 }}>Snapshot · {genDate}</div>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0, background:'rgba(255,255,255,0.08)', borderRadius:20, padding:'3px 8px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round"><path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.55)', fontWeight:500 }}>Read Only</span>
          </div>
        </div>

        {/* TZ row — always full width on mobile */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding: mobile ? '6px 14px 10px' : '0 28px 10px', justifyContent: mobile ? 'space-between' : 'center' }}>
          <span style={{ fontSize:11, color:'rgba(153,246,228,0.65)', fontWeight:500 }}>Timezone</span>
          <div style={{ display:'flex', background:'rgba(0,0,0,0.25)', borderRadius:8, padding:3, gap:2 }}>
            {['IST','EST','PST'].map(tz => (
              <button key={tz} onClick={() => setTimezone(tz)} style={{
                padding:'5px 16px', borderRadius:6, border:'none', cursor:'pointer',
                fontSize:12, fontWeight:700, transition:'all 0.15s',
                background: timezone===tz ? '#fff' : 'transparent',
                color: timezone===tz ? '#0f766e' : 'rgba(255,255,255,0.6)',
                boxShadow: timezone===tz ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
              }}>{tz}</button>
            ))}
          </div>
          <span style={{ fontSize:11, color:'rgba(153,246,228,0.5)', fontWeight:500 }}>
            {mobile ? tzInfo.utc : `${tzInfo.name} · ${tzInfo.utc}`}
          </span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth:1440, margin:'0 auto', padding: mobile ? '14px 12px 40px' : '24px 28px 80px' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns: mobile ? 'repeat(3,1fr)' : 'repeat(5,1fr)', gap: mobile ? 8 : 14, marginBottom: mobile ? 12 : 20 }}>
          {[
            { label:'Engineers', value:engineers.length, color:'#0891b2', bg:'#e0f2fe' },
            { label:'Working',   value:stats.working,   color:'#16a34a', bg:'#dcfce7' },
            { label:'On Leave',  value:stats.leave,     color:'#dc2626', bg:'#fee2e2' },
            { label:'Weekly Off',value:stats.weeklyOff, color:'#0d9488', bg:'#ccfbf1' },
            { label:'On Call',   value:stats.onCall,    color:'#7c3aed', bg:'#ede9fe' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius: mobile ? 10 : 12, padding: mobile ? '10px 10px' : '16px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap: mobile ? 8 : 14 }}>
              <div style={{ width: mobile ? 32 : 40, height: mobile ? 32 : 40, borderRadius:10, background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize: mobile ? 15 : 18, fontWeight:800 }}>{s.value}</div>
              <div style={{ fontSize: mobile ? 10 : 12, color:'#6b7280', fontWeight:500, lineHeight:1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TZ info banner */}
        <div style={{ background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', border:'1px solid #a7f3d0', borderRadius:8, padding:'8px 14px', display:'flex', alignItems:'center', gap:8, marginBottom: mobile ? 12 : 18, flexWrap:'wrap' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span style={{ fontSize:12, color:'#065f46', fontWeight:500 }}>
            Times in <strong>{timezone}</strong> — {tzInfo.name} ({tzInfo.utc})
          </span>
        </div>

        {/* Table */}
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
            <table className="rv-table">
              <thead>
                <tr>
                  <th>Engineer</th>
                  <th>Shift</th>
                  {days.map(day => (
                    <th key={day.id} className={`day-col${day.isWeekend?' wknd':''}`}>
                      <div>{day.short}</div>
                      <div style={{ fontSize:9, opacity:0.6, marginTop:1 }}>{day.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {engineers.map((eng) => (
                  <tr key={eng.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#0d9488,#0f766e)', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{eng.name[0]}</div>
                        <div>
                          <div style={{ fontWeight:600, color:'#111827', fontSize:12 }}>{eng.name}</div>
                          <div style={{ fontSize:10, color:'#9ca3af' }}>{eng.role||'Engineer'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:20, background:SHIFTS[eng.shift]?.bg||'#f3f4f6', color:SHIFTS[eng.shift]?.color||'#374151' }}>
                        {SHIFTS[eng.shift]?.label||eng.shift}
                      </span>
                    </td>
                    {days.map(day => {
                      const entry = schedule?.[eng.id]?.[day.id]
                      if (!entry) return <td key={day.id} className={day.isWeekend?'wknd-cell':''} />
                      const st  = STATUSES[entry.status] || STATUSES.WORKING
                      const isW = entry.status==='WORKING'
                      return (
                        <td key={day.id} className={day.isWeekend?'wknd-cell':''}>
                          <div className="rv-chip" style={{ background:st.bg, color:st.color }}>
                            {st.label}
                            {entry.isOnCall && <span className="rv-oc">OC</span>}
                          </div>
                          {isW && entry.startTime && (
                            <div className="rv-time">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2"/></svg>
                              {convertTime(entry.startTime,timezone)} – {convertTime(entry.endTime,timezone)}
                            </div>
                          )}
                          {entry.notes && <div style={{ fontSize:9, color:'#9ca3af', marginTop:2, fontStyle:'italic' }}>{entry.notes}</div>}
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
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:14, alignItems:'center' }}>
          <span style={{ fontSize:11, color:'#6b7280', fontWeight:500 }}>Legend:</span>
          {Object.entries(STATUSES).map(([k,s]) => (
            <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:4, background:s.bg, color:s.color, fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:20 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:s.color }} />{s.label}
            </span>
          ))}
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#ede9fe', color:'#7c3aed', fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:20 }}>
            <span className="rv-oc">OC</span>On Call
          </span>
        </div>

        {/* Footer */}
        <div style={{ marginTop:16, textAlign:'center', fontSize:11, color:'#9ca3af', padding:'10px 16px', background:'#fff', borderRadius:8, border:'1px solid #f3f4f6' }}>
          🔒 Read-only · Times in <strong>{timezone}</strong> ({tzInfo.utc}) · Snapshot {genDate}
        </div>
      </main>
    </div>
  )
}