export const TZ_INFO = {
  IST: { name: 'India Standard Time',   utc: 'UTC +5:30', offsetH: 0,  offsetM: 0  },
  EST: { name: 'US Eastern Standard',   utc: 'UTC −5:00', offsetH: 10, offsetM: 30 },
  PST: { name: 'US Pacific Standard',   utc: 'UTC −8:00', offsetH: 13, offsetM: 30 },
}

function parseTime(str) {
  if (!str) return 0
  const [time, ampm] = str.trim().split(' ')
  let [h, m] = time.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function formatMins(mins) {
  while (mins < 0)    { mins += 1440 }
  while (mins >= 1440){ mins -= 1440 }
  const h    = Math.floor(mins / 60)
  const m    = mins % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h
  return {
    time: `${h12}:${m.toString().padStart(2, '0')} ${ampm}`,
    note: '',
  }
}

export function convertTime(istStr, tz) {
  if (!istStr) return { time: '—', note: '' }
  if (tz === 'IST') return { time: istStr, note: '' }
  const { offsetH, offsetM } = TZ_INFO[tz]
  return formatMins(parseTime(istStr) - offsetH * 60 - offsetM)
}
