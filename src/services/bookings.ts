import type { Booking, PaginatedResponse } from '@/types'
import { api } from '@/lib/api'

type BookingFilters = {
  property_id?: string
  status?: string
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

export async function getBookings(filters: BookingFilters = {}): Promise<PaginatedResponse<Booking>> {
  const { data } = await api.get<PaginatedResponse<Booking>>('/bookings', { params: filters })
  return data
}
