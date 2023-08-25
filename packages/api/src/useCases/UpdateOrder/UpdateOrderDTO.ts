import { Customer } from '../../entities/Customer'
import { OrderProducts } from '../../entities/OrderProducts'

export interface IUpdateOrderDTO {
  id: string
  createdAt: Date
  status: number
  discount: number
  total: number
  customerId: string
  shipping: number
  employeeId: string
  companyId: string
  products: OrderProducts[]
  obs?: string
  payMethodId?: string
  Customer?: Customer
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
  propertyId?: string
  customerApoioProperty?: string
}
