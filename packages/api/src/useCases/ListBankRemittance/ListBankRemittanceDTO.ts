export interface IListBankRemittanceFilters {
  numberLot?: number
  bankAccountId?: string
  minCreatedAtDate?: Date
  maxCreatedAtDate?: Date
  page?: number
  perPage?: number
  orderBy?: string
  companyId?: string
}
