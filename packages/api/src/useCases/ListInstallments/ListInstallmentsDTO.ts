export interface IListInstallmentFilters {
  customer?: string
  minDueDate?: Date
  maxDueDate?: Date
  paymentMethodId?: string
  minCreatedAtDate?: Date
  maxCreatedAtDate?: Date
  bankRemittanceId?: string
  bankAccountId?: string
  customerApoioName?: string
  ourNumer?: string
  numeroDoc?: string
  isPaid?: boolean
  page?: number
  perPage?: number
  orderBy?: string
  companyId?: string
  wallet?: number
  bankRemittance?: boolean
}
