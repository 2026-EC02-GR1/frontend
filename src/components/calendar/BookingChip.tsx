import type { Booking } from '@/types'
import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<Booking['status'], string> = {
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  refunded:  'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_LABELS: Record<Booking['status'], string> = {
  confirmed: 'Confirmée',
  pending:   'En attente',
  cancelled: 'Annulée',
  refunded:  'Remboursée',
}

type Props = {
  booking: Booking
  propertyName?: string
  onClick: (booking: Booking) => void
}

export function BookingChip({ booking, propertyName, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(booking)}
      className={`w-full text-left text-xs px-1.5 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity ${STATUS_STYLES[booking.status]}`}
      title={`${booking.client.first_name} ${booking.client.last_name}${propertyName ? ` — ${propertyName}` : ''}`}
    >
      {booking.client.first_name} {booking.client.last_name[0]}.
    </button>
  )
}

export function BookingStatusBadge({ status }: { status: Booking['status'] }) {
  const styles: Record<Booking['status'], string> = {
    confirmed: 'bg-green-100 text-green-800',
    pending:   'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded:  'bg-gray-100 text-gray-600',
  }
  return (
    <Badge className={`text-xs font-medium ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
