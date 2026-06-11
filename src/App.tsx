import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { BookingCalendarPage } from '@/pages/BookingCalendarPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
        <span className="text-lg font-bold text-blue-600">Résa</span>
        <nav className="flex gap-4 text-sm">
          <NavLink
            to="/bookings/calendar"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
            }
          >
            Planning
          </NavLink>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route index element={<Navigate to="/bookings/calendar" replace />} />
          <Route path="/bookings/calendar" element={<BookingCalendarPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
