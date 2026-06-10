import { BookingCalendar } from '@/components/calendar/BookingCalendar'

export function BookingCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Planning des réservations</h1>
        <p className="text-sm text-gray-500 mt-1">Visualisez vos réservations mois par mois</p>
      </div>
      <BookingCalendar />
    </div>
  )
}
