export interface IUpdateBudgetDTO {
  id: string
  createdAt: Date
  status: number
  discount: number
  total: number
  deliveryForecast: Date
  customerId: string
  shipping: number
  employeeId: string
  auth: boolean
  companyId: string
  payMethodId: string
  obs?: string
  BudgetProducts: any[]
  customerApoioId?: string
  customerApoioName?: string
  stateInscriptionApoio?: string
  emailApoio?: string
  phoneApoio?: string
  addressApoio?: string
  addressNumberApoio?: string
  complementApoio?: string
  provinceApoio?: string
  postalCodeApoio?: string
  cityIdApoio?: number
  cityApoio?: string
  stateApoio?: string
  cpfCnpjApoio?: string
  installments?: string
  paymentMean?: number
  propertyId?: string
  customerIdApoio?: number
  customerApoioProperty?: string
}
