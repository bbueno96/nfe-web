import { BudgetProducts } from '../../entities/BudgetProducts'
import { Customer } from '../../entities/Customer'

export interface ICreateBudgetDTO {
  numberBudget: number
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
  products: BudgetProducts[]
  Customer?: Customer
  obs?: string
  payMethodId?: string
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
