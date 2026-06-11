import type { Property, PaginatedResponse } from '@/types'
import { api } from '@/lib/api'

export async function getProperties(): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get<PaginatedResponse<Property>>('/properties')
  return data
}
