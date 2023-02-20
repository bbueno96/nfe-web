export interface IListAccountPayableFilters {
  minCreatedAtDate?: Date
  maxCreatedAtDate?: Date
  minDueDate?: Date
  maxDueDate?: Date
  providerId?: number
  document?: string
  isPaid?: boolean
  page?: number
  perPage?: number
  orderBy?: string
  companyId?: string
}
