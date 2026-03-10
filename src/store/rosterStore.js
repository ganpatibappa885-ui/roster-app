import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ===========================
   STATUS & SHIFT CONSTANTS
=========================== */
export const STATUSES = {
  WORKING:      { label: 'Working',        color: '#16a34a', bg: '#dcfce7' },
  WEEKLY_OFF:   { label: 'Weekly Off',     color: '#0d9488', bg: '#ccfbf1' },
  ANNUAL_LEAVE: { label: 'Annual Leave',   color: '#dc2626', bg: '#fee2e2' },
  COMP_OFF:     { label: 'Comp Off',       color: '#db2777', bg: '#fce7f3' },
  SICK_LEAVE:   { label: 'Sick Leave',     color: '#d97706', bg: '#fef3c7' },
  PUBLIC_HOL:   { label: 'Public Holiday', color: '#7c3aed', bg: '#ede9fe' },
  ON_CALL:      { label: 'On Call',        color: '#0891b2', bg: '#cffafe' },
}

export const SHIFTS = {
  Night:     { label: 'Night',     color: '#3730a3', bg: '#e0e7ff' },
  Morning:   { label: 'Morning',   color: '#065f46', bg: '#d1fae5' },
  Afternoon: { label: 'Afternoon', color: '#92400e', bg: '#fef3c7' },
  Evening:   { label: 'Evening',   color: '#7c2d12', bg: '#ffedd5' },
}

/* ===========================
   DEFAULT ENGINEERS (ALL 12)
=========================== */
const DEFAULT_ENGINEERS = [
  { id: 'aslam',      name: 'Aslam',      role: 'Engineer', shift: 'Night'     },
  { id: 'ayan',       name: 'Ayan',       role: 'Engineer', shift: 'Morning'   },
  { id: 'chirantan',  name: 'Chirantan',  role: 'Engineer', shift: 'Night'     },
  { id: 'faizal',     name: 'Faizal',     role: 'Engineer', shift: 'Morning'   },
  { id: 'hemant',     name: 'Hemant',     role: 'Engineer', shift: 'Morning'   },
  { id: 'lazarus',    name: 'Lazarus',    role: 'Engineer', shift: 'Morning'   },
  { id: 'mark',       name: 'Mark',       role: 'Engineer', shift: 'Night'     },
  { id: 'shashi',     name: 'Shashi',     role: 'Engineer', shift: 'Morning'   },
  { id: 'shashidhar', name: 'Shashidhar', role: 'Engineer', shift: 'Afternoon' },
  { id: 'siraj',      name: 'Siraj',      role: 'Engineer', shift: 'Morning'   },
  { id: 'venkatesh',  name: 'Venkatesh',  role: 'Engineer', shift: 'Night'     },
  { id: 'vikrant',    name: 'Vikrant',    role: 'Engineer', shift: 'Night'     },
]

/* Engineers with weekday-only schedule (off Sat+Sun) */
const WEEKDAY_ONLY = ['aslam','vikrant','faizal','lazarus','hemant','shashidhar','chirantan','siraj']
/* Engineers with weekend-only schedule (off Mon-Fri) */
const WEEKEND_ONLY = ['mark','ayan']

/* Individual shift times (IST) */
const SHIFT_TIMES = {
  aslam:      { start: '12:00 AM', end: '5:30 AM'  },
  ayan:       { start: '7:00 AM',  end: '10:30 AM' },
  chirantan:  { start: '12:00 AM', end: '1:00 AM'  },
  faizal:     { start: '9:30 AM',  end: '6:30 PM'  },
  hemant:     { start: '10:00 AM', end: '11:30 PM' },
  lazarus:    { start: '9:30 AM',  end: '11:00 PM' },
  mark:       { start: '7:30 AM',  end: '10:30 PM' },
  shashi:     { start: '8:00 AM',  end: '6:30 PM'  },
  shashidhar: { start: '11:00 AM', end: '7:00 PM'  },
  siraj:      { start: '9:00 AM',  end: '9:00 PM'  },
  venkatesh:  { start: '12:30 AM', end: '10:30 PM' },
  vikrant:    { start: '12:30 AM', end: '9:30 AM'  },
}

/* ===========================
   WEEK GENERATOR
=========================== */
function generateWeek(startDateStr) {
  const start = new Date(startDateStr)
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      id:        date.toISOString().slice(0, 10),
      label:     date.toLocaleDateString('en-US', { weekday: 'long'  }),
      short:     date.toLocaleDateString('en-US', { weekday: 'short' }),
      date:      date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
  }
  return days
}

function formatWeekEnding(startDateStr) {
  const end = new Date(startDateStr)
  end.setDate(end.getDate() + 6)
  return end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ===========================
   DEFAULT SCHEDULE BUILDER
=========================== */
function buildDefaultSchedule(days, engineers) {
  const schedule = {}
  engineers.forEach(eng => {
    schedule[eng.id] = {}
    days.forEach(day => {
      let status = 'WORKING'
      if (WEEKDAY_ONLY.includes(eng.id) && day.isWeekend) status = 'WEEKLY_OFF'
      if (WEEKEND_ONLY.includes(eng.id) && !day.isWeekend) status = 'WEEKLY_OFF'
      schedule[eng.id][day.id] = {
        status,
        shift:     eng.shift,
        startTime: SHIFT_TIMES[eng.id]?.start || '9:00 AM',
        endTime:   SHIFT_TIMES[eng.id]?.end   || '6:00 PM',
        isOnCall:  false,
        notes:     '',
      }
    })
  })
  return schedule
}

/* ===========================
   INITIAL WEEK SETUP
=========================== */
const DEFAULT_START = '2026-02-23'
const initialDays   = generateWeek(DEFAULT_START)
const initialWeek   = {
  id:        DEFAULT_START,
  startDate: DEFAULT_START,
  weekLabel: `Week Ending ${formatWeekEnding(DEFAULT_START)}`,
  days:      initialDays,
  schedule:  buildDefaultSchedule(initialDays, DEFAULT_ENGINEERS),
}

/* ===========================
   STORE
=========================== */
export const useRosterStore = create(
  persist(
    (set, get) => ({

      /* STATE */
      engineers:    DEFAULT_ENGINEERS,
      activeWeekId: DEFAULT_START,
      weeks: {
        [DEFAULT_START]: initialWeek,
      },

      /* ── WEEK ACTIONS ── */
      createWeek: (startDate) => {
        const days      = generateWeek(startDate)
        const engineers = get().engineers
        const newWeek   = {
          id:        startDate,
          startDate,
          weekLabel: `Week Ending ${formatWeekEnding(startDate)}`,
          days,
          schedule:  buildDefaultSchedule(days, engineers),
        }
        set(state => ({
          weeks: { ...state.weeks, [startDate]: newWeek },
          activeWeekId: startDate,
        }))
      },

      setActiveWeek: (weekId) => set({ activeWeekId: weekId }),

      updateWeekLabel: (weekId, label) => {
        const { weeks } = get()
        set({ weeks: { ...weeks, [weekId]: { ...weeks[weekId], weekLabel: label } } })
      },

      /* ── ENGINEER ACTIONS ── */
      addEngineer: (data) => {
        const id          = data.name.toLowerCase().replace(/\s+/g, '_')
        const newEngineer = { id, name: data.name, role: data.role, shift: data.shift }
        const { engineers, weeks } = get()
        const updatedWeeks = {}
        Object.keys(weeks).forEach(weekId => {
          const week        = weeks[weekId]
          const newSchedule = { ...week.schedule, [id]: {} }
          week.days.forEach(day => {
            newSchedule[id][day.id] = {
              status: 'WORKING', shift: data.shift,
              startTime: '9:00 AM', endTime: '6:00 PM',
              isOnCall: false, notes: '',
            }
          })
          updatedWeeks[weekId] = { ...week, schedule: newSchedule }
        })
        set({ engineers: [...engineers, newEngineer], weeks: updatedWeeks })
      },

      removeEngineer: (id) => {
        const { engineers, weeks } = get()
        const updatedWeeks = {}
        Object.keys(weeks).forEach(weekId => {
          const week        = weeks[weekId]
          const newSchedule = { ...week.schedule }
          delete newSchedule[id]
          updatedWeeks[weekId] = { ...week, schedule: newSchedule }
        })
        set({ engineers: engineers.filter(e => e.id !== id), weeks: updatedWeeks })
      },

      updateEngineer: (id, updates) => {
        const { engineers } = get()
        set({ engineers: engineers.map(e => e.id === id ? { ...e, ...updates } : e) })
      },

      /* ── SCHEDULE UPDATE ── */
      updateScheduleEntry: (engId, dayId, updates) => {
        const { activeWeekId, weeks } = get()
        const activeWeek = weeks[activeWeekId]
        set({
          weeks: {
            ...weeks,
            [activeWeekId]: {
              ...activeWeek,
              schedule: {
                ...activeWeek.schedule,
                [engId]: {
                  ...activeWeek.schedule[engId],
                  [dayId]: { ...activeWeek.schedule[engId][dayId], ...updates },
                },
              },
            },
          },
        })
      },

      /* ── RESET ── */
      resetToDefaults: () => {
        localStorage.removeItem('roster-storage-v2')
        window.location.reload()
      },

    }),
    { name: 'roster-storage-v2' }
  )
)
