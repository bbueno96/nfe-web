import { Customer } from '../../entities/Customer'
import { OrderProducts } from '../../entities/OrderProducts'

export interface ICreateOrderDTO {
  numberOrder: number
  createdAt: Date
  status: number
  discount: number
  total: number
  customerId?: string
  shipping: number
  employeeId: string
  companyId: string
  products: OrderProducts[]
  obs?: string
  payMethodId?: string
  Customer?: Customer
  budgetId?: string
  customerApoioId?: string
  customerApoioName?: string
  installments?: string
  paymentMean?: number
  propertyId?: string
  customerApoioProperty?: string
}
