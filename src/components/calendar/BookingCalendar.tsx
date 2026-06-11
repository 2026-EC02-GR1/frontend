import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingChip } from './BookingChip'
import { BookingDetail } from './BookingDetail'
import { getBookings } from '@/services/bookings'
import { getProperties } from '@/services/properties'
import type { Booking, Property } from '@/types'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

function toISO(date: Date) {
  return date.toISOString().split('T')[0]
}

function isoToDate(iso: string) {
  return new Date(iso + 'T00:00:00')
}

export function BookingCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // 0-indexed
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Bornes du mois
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = toISO(firstDay)
  const endDate = toISO(lastDay)

  const { data: propertiesData } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', year, month, selectedPropertyId],
    queryFn: () => getBookings({
      property_id: selectedPropertyId !== 'all' ? selectedPropertyId : undefined,
      start_date: startDate,
      end_date: endDate,
      per_page: 100,
    }),
  })

  const properties: Property[] = propertiesData?.data ?? []
  const bookings: Booking[] = bookingsData?.data ?? []

  // Grille des jours du mois (avec padding pour commencer le bon jour)
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = []
    // Jour de la semaine du 1er (0=dim → on convertit en lun=0)
    let startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    for (let i = 0; i < startWeekDay; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
    return days
  }, [year, month, firstDay, lastDay])

  // Index : date ISO → bookings actifs ce jour
  const bookingsByDay = useMemo(() => {
    const map: Record<string, Booking[]> = {}
    bookings.forEach((b) => {
      const checkIn = isoToDate(b.check_in)
      const checkOut = isoToDate(b.check_out)
      const cur = new Date(checkIn)
      while (cur < checkOut) {
        const key = toISO(cur)
        if (!map[key]) map[key] = []
        map[key].push(b)
        cur.setDate(cur.getDate() + 1)
      }
    })
    return map
  }, [bookings])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const selectedProperty = properties.find(p => p.id === selectedBooking?.property_id)

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Navigation mois */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold w-44 text-center">
            {MONTHS[month]} {year}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()) }}>
            Aujourd'hui
          </Button>
        </div>

        {/* Filtre propriété */}
        <select
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les logements</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Légende statuts */}
      <div className="flex gap-4 text-xs flex-wrap">
        {[
          { label: 'Confirmée', cls: 'bg-green-100 text-green-800 border-green-200' },
          { label: 'En attente', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
          { label: 'Annulée', cls: 'bg-red-100 text-red-800 border-red-200' },
          { label: 'Remboursée', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
        ].map(({ label, cls }) => (
          <span key={label} className={`px-2 py-0.5 rounded border ${cls}`}>{label}</span>
        ))}
      </div>

      {/* Grille */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* En-têtes jours */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {DAYS.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium text-gray-500">{d}</div>
          ))}
        </div>

        {/* Cellules */}
        <div className="grid grid-cols-7">
          {isLoading ? (
            <div className="col-span-7 py-20 text-center text-gray-400">Chargement…</div>
          ) : (
            calendarDays.map((date, i) => {
              if (!date) {
                return <div key={`empty-${i}`} className="min-h-24 bg-gray-50 border-b border-r border-gray-100" />
              }
              const iso = toISO(date)
              const dayBookings = bookingsByDay[iso] ?? []
              const isToday = iso === toISO(today)

              return (
                <div
                  key={iso}
                  className={`min-h-24 p-1.5 border-b border-r border-gray-100 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <p className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </p>
                  <div className="space-y-0.5">
                    {dayBookings.slice(0, 3).map((b) => (
                      <BookingChip
                        key={b.id}
                        booking={b}
                        propertyName={properties.find(p => p.id === b.property_id)?.name}
                        onClick={setSelectedBooking}
                      />
                    ))}
                    {dayBookings.length > 3 && (
                      <p className="text-xs text-gray-400 pl-1">+{dayBookings.length - 3}</p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Modal détail */}
      {selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          property={selectedProperty}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  )
}
