// ─── Auth ────────────────────────────────────────────────────────────────────

export type TokenResponse = {
  access_token: string
  expires_in: number
}

// ─── Manager ─────────────────────────────────────────────────────────────────

export type Manager = {
  id: string
  name: string
  email: string
  phone?: string
  stripe_account_id?: string
  two_fa_enabled: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ─── Property ────────────────────────────────────────────────────────────────

export type Property = {
  id: string
  manager_id: string
  name: string
  description?: string
  address: string
  city: string
  zip_code: string
  country: string
  max_capacity: number
  nb_bedrooms?: number
  nb_bathrooms?: number
  active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ─── Client ──────────────────────────────────────────────────────────────────

export type Client = {
  id: string
  last_name: string
  first_name: string
  email: string
  phone?: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded'
export type BookingSource = 'direct' | 'airbnb' | 'booking'

export type Booking = {
  id: string
  property_id: string | null
  client_id: string | null
  client: Client
  hold_slot_id: string | null
  check_in: string
  check_out: string
  nb_nights: number
  nb_guests: number
  total_amount: number
  deposit_amount: number
  balance_amount: number
  status: BookingStatus
  source: BookingSource
  external_reference: string | null
  created_at: string
  updated_at: string
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentType = 'deposit' | 'balance' | 'full'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export type Payment = {
  id: string
  booking_id: string
  stripe_payment_intent_id: string
  amount: number
  type: PaymentType
  status: PaymentStatus
  created_at: string
}

// ─── Availability ────────────────────────────────────────────────────────────

export type BlockedSource = 'manual' | 'ical_airbnb' | 'ical_booking' | 'booking_confirmed'

export type Availability = {
  date: string
  blocked: boolean
  source?: BlockedSource | null
}

export type PriceEstimate = {
  check_in: string
  check_out: string
  nb_nights: number
  base_amount: number
  discount_percentage: number
  total_amount: number
  deposit_amount: number
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  per_page: number
}

// ─── API Error ───────────────────────────────────────────────────────────────

export type ApiError = {
  code: string
  message: string
}

export type ValidationError = ApiError & {
  fields: { field: string; message: string }[]
}
