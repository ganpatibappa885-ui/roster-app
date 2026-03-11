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
  Night:     { color: '#3730a3', bg: '#e0e7ff' },
  Morning:   { color: '#065f46', bg: '#d1fae5' },
  Afternoon: { color: '#92400e', bg: '#fef3c7' },
  Evening:   { color: '#7c2d12', bg: '#ffedd5' },
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

export default function RosterView() {
  const [timezone, setTimezone] = useState('IST')
  const [snapshot, setSnapshot] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const snapshotId = useMemo(() => window.location.hash.split('#/view/')[1] || null, [])

  useEffect(() => {
    if (!snapshotId) { setError('No snapshot ID in this link.'); setLoading(false); return }
    loadSnapshot(snapshotId).then(data => {
      if (!data) setError('Snapshot not found or expired.')
      else setSnapshot(data)
      setLoading(false)
    }).catch(() => { setError('Failed to load roster.'); setLoading(false) })
  }, [snapshotId])

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0f766e,#134e4a)',gap:16}}>
      <div style={{width:44,height:44,borderRadius:'50%',border:'4px solid rgba(255,255,255,0.15)',borderTopColor:'#5eead4',animation:'spin 0.8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:'rgba(255,255,255,0.7)',fontSize:14}}>Loading roster…</p>
    </div>
  )

  if (!snapshot || error) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0f766e,#134e4a)',padding:24}}>
      <div style={{background:'#fff',borderRadius:16,padding:'40px 32px',textAlign:'center',maxWidth:380,width:'100%'}}>
        <div style={{width:52,height:52,borderRadius:'50%',background:'#fee2e2',color:'#dc2626',fontSize:22,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>!</div>
        <h2 style={{fontSize:18,fontWeight:700,color:'#111827',marginBottom:8}}>Link Not Found</h2>
        <p style={{color:'#6b7280',lineHeight:1.6,fontSize:14,marginBottom:20}}>{error || 'This roster link is invalid or expired.'}</p>
        <button onClick={()=>{window.location.href=window.location.origin}} style={{padding:'10px 24px',background:'linear-gradient(135deg,#0f766e,#134e4a)',color:'#fff',border:'none',borderRadius:8,fontWeight:700,fontSize:14,cursor:'pointer'}}>
          Go to App →
        </button>
      </div>
    </div>
  )

  const { weekLabel, generatedAt, days, engineers, schedule } = snapshot
  const tzInfo  = TZ_INFO[timezone]
  const genDate = new Date(generatedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})

  const stats = (() => {
    let working=0,leave=0,onCall=0,weeklyOff=0
    engineers.forEach(eng => days.forEach(day => {
      const e = schedule[eng.id]?.[day.id]
      if (!e) return
      if (e.status==='WORKING') working++
      if (['ANNUAL_LEAVE','SICK_LEAVE','COMP_OFF'].includes(e.status)) leave++
      if (e.status==='WEEKLY_OFF') weeklyOff++
      if (e.isOnCall) onCall++
    }))
    return {working,leave,onCall,weeklyOff}
  })()

  return (
    <div style={{minHeight:'100vh',background:'#f0faf8',fontFamily:'Inter,system-ui,sans-serif'}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        .rv-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        table{border-collapse:collapse;width:100%;}
        .rv-th{background:linear-gradient(135deg,#0f766e,#134e4a);color:#fff;padding:10px 12px;font-weight:600;font-size:11px;white-space:nowrap;border-right:1px solid rgba(255,255,255,0.08);text-align:left;}
        .rv-th.center{text-align:center;}
        .rv-th.wknd{background:linear-gradient(135deg,#064e3b,#022c22)!important;}
        .rv-th-eng{position:sticky;left:0;z-index:3;min-width:140px;}
        .rv-th-shift{min-width:90px;}
        .rv-th-day{min-width:115px;text-align:center;}
        .rv-td{padding:8px 10px;border-bottom:1px solid #f0f0f0;border-right:1px solid #f5f5f5;vertical-align:top;font-size:12px;}
        .rv-td-eng{position:sticky;left:0;z-index:1;background:inherit;min-width:140px;}
        tr:nth-child(even){background:#f9fffe;}
        tr:nth-child(odd){background:#fff;}
        tr:hover{background:#ecfdf5!important;}
        .rv-td.wknd{background:rgba(204,251,241,0.12)!important;}
        .chip{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:600;padding:3px 8px;border-radius:20px;white-space:nowrap;margin-bottom:3px;}
        .time{font-size:10px;color:#4b5563;display:flex;align-items:center;gap:3px;margin-top:1px;}
        .oc-badge{background:#7c3aed;color:#fff;font-size:8px;font-weight:700;padding:1px 5px;border-radius:5px;margin-left:3px;}
        .tz-btn{padding:6px 16px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700;transition:all 0.15s;}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{background:'linear-gradient(135deg,#0f766e,#134e4a)',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,0.2)'}}>
        {/* Row 1: title + read-only badge */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px 8px',gap:12}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:'#fff',letterSpacing:'-0.03em',lineHeight:1.2}}>{weekLabel}</div>
            <div style={{fontSize:11,color:'rgba(153,246,228,0.6)',marginTop:3}}>Snapshot · {genDate}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.1)',borderRadius:20,padding:'5px 12px',flexShrink:0}}>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.7)',fontWeight:500}}>🔒 Read Only</span>
          </div>
        </div>

        {/* Row 2: TZ switcher */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px 12px',gap:12,flexWrap:'wrap'}}>
          <span style={{fontSize:11,color:'rgba(153,246,228,0.55)',fontWeight:500}}>{tzInfo.name} · {tzInfo.utc}</span>
          <div style={{display:'flex',background:'rgba(0,0,0,0.25)',borderRadius:8,padding:3,gap:2,flexShrink:0}}>
            {['IST','EST','PST'].map(tz=>(
              <button key={tz} className="tz-btn" onClick={()=>setTimezone(tz)} style={{
                background:timezone===tz?'#fff':'transparent',
                color:timezone===tz?'#0f766e':'rgba(255,255,255,0.55)',
                boxShadow:timezone===tz?'0 1px 4px rgba(0,0,0,0.15)':'none',
              }}>{tz}</button>
            ))}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{maxWidth:1400,margin:'0 auto',padding:'16px 14px 60px'}}>

        {/* Stats row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:10,marginBottom:14}}>
          {[
            {label:'Engineers',value:engineers.length,color:'#0891b2',bg:'#e0f2fe'},
            {label:'Working',  value:stats.working,  color:'#16a34a',bg:'#dcfce7'},
            {label:'On Leave', value:stats.leave,    color:'#dc2626',bg:'#fee2e2'},
            {label:'Weekly Off',value:stats.weeklyOff,color:'#0d9488',bg:'#ccfbf1'},
            {label:'On Call',  value:stats.onCall,   color:'#7c3aed',bg:'#ede9fe'},
          ].map(s=>(
            <div key={s.label} style={{background:'#fff',borderRadius:12,padding:'12px 14px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',border:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:s.bg,color:s.color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:16,flexShrink:0}}>{s.value}</div>
              <div style={{fontSize:11,color:'#6b7280',fontWeight:500,lineHeight:1.3}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{background:'#fff',borderRadius:12,border:'1px solid #e5e7eb',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',overflow:'hidden'}}>
          <div className="rv-wrap">
            <table>
              <thead>
                <tr>
                  <th className="rv-th rv-th-eng">Engineer</th>
                  <th className="rv-th rv-th-shift">Shift</th>
                  {days.map(day=>(
                    <th key={day.id} className={`rv-th rv-th-day${day.isWeekend?' wknd':''}`}>
                      <div>{day.short}</div>
                      <div style={{fontSize:9,opacity:0.55,marginTop:1,fontWeight:500}}>{day.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {engineers.map(eng=>(
                  <tr key={eng.id}>
                    <td className="rv-td rv-td-eng">
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#0d9488,#0f766e)',color:'#fff',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{eng.name[0]}</div>
                        <div>
                          <div style={{fontWeight:600,color:'#111827',fontSize:12,whiteSpace:'nowrap'}}>{eng.name}</div>
                          <div style={{fontSize:10,color:'#9ca3af'}}>{eng.role||'Engineer'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="rv-td">
                      <span className="chip" style={{background:SHIFTS[eng.shift]?.bg||'#f3f4f6',color:SHIFTS[eng.shift]?.color||'#374151'}}>
                        {eng.shift}
                      </span>
                    </td>
                    {days.map(day=>{
                      const entry = schedule?.[eng.id]?.[day.id]
                      if (!entry) return <td key={day.id} className={`rv-td${day.isWeekend?' wknd':''}`}/>
                      const st = STATUSES[entry.status]||STATUSES.WORKING
                      return (
                        <td key={day.id} className={`rv-td${day.isWeekend?' wknd':''}`}>
                          <div className="chip" style={{background:st.bg,color:st.color}}>
                            {st.label}
                            {entry.isOnCall&&<span className="oc-badge">OC</span>}
                          </div>
                          {entry.status==='WORKING'&&entry.startTime&&(
                            <div className="time">
                              🕐 {convertTime(entry.startTime,timezone)}–{convertTime(entry.endTime,timezone)}
                            </div>
                          )}
                          {entry.notes&&<div style={{fontSize:9,color:'#9ca3af',marginTop:2,fontStyle:'italic'}}>{entry.notes}</div>}
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
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:12,alignItems:'center'}}>
          <span style={{fontSize:11,color:'#6b7280',fontWeight:600}}>Legend:</span>
          {Object.entries(STATUSES).map(([k,s])=>(
            <span key={k} className="chip" style={{background:s.bg,color:s.color}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:s.color,display:'inline-block'}}/>{s.label}
            </span>
          ))}
          <span className="chip" style={{background:'#ede9fe',color:'#7c3aed'}}>
            <span className="oc-badge" style={{margin:0}}>OC</span> On Call
          </span>
        </div>

        {/* Footer */}
        <div style={{marginTop:14,textAlign:'center',fontSize:11,color:'#9ca3af',padding:'10px',background:'#fff',borderRadius:8,border:'1px solid #f3f4f6'}}>
          Read-only · Times in {timezone} ({tzInfo.utc}) · Snapshot {genDate} · Contact your manager to make changes
        </div>
      </main>
    </div>
  )
}