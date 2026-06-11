import type { Booking, Property } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingStatusBadge } from './BookingChip'

type Props = {
  booking: Booking
  property?: Property
  onClose: () => void
}

const SOURCE_LABELS: Record<Booking['source'], string> = {
  direct:  'Direct',
  airbnb:  'Airbnb',
  booking: 'Booking.com',
}

export function BookingDetail({ booking, property, onClose }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  const formatAmount = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-base">
              {booking.client.first_name} {booking.client.last_name}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">{booking.client.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <span className="text-gray-500">{SOURCE_LABELS[booking.source]}</span>
            {booking.external_reference && (
              <span className="text-gray-400 text-xs">#{booking.external_reference}</span>
            )}
          </div>

          {property && (
            <div>
              <span className="text-gray-500">Logement : </span>
              <span className="font-medium">{property.name}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
            <div>
              <p className="text-gray-500 text-xs">Arrivée</p>
              <p className="font-medium">{formatDate(booking.check_in)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Départ</p>
              <p className="font-medium">{formatDate(booking.check_out)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Nuits</p>
              <p className="font-medium">{booking.nb_nights}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Voyageurs</p>
              <p className="font-medium">{booking.nb_guests}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-500 text-xs">Total</p>
              <p className="font-semibold">{formatAmount(booking.total_amount)}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-500 text-xs">Acompte</p>
              <p className="font-semibold">{formatAmount(booking.deposit_amount)}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-500 text-xs">Solde</p>
              <p className="font-semibold">{formatAmount(booking.balance_amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
