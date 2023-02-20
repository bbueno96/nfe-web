export interface IListAccountPaymentFilters {
  bankAccountId?: string
  maxDueDate?: Date
  minDueDate?: Date
  paymentMeanId?: string
  page?: number
  perPage?: number
  orderBy?: string
  companyId?: string
}
