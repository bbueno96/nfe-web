import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Order {
  id?: string
  numberOrder: number
  createdAt: Date
  status?: number | null
  discount?: Prisma.Decimal | null
  total: Prisma.Decimal
  customerId?: string | null
  shipping?: Prisma.Decimal | null
  employeeId: string
  payMethodId?: string | null
  companyId?: string | null
  obs?: string | null
  disabledAt?: Date | null
  budgetId?: string | null
  customerApoioId?: string | null
  customerApoioName?: string | null
  stateInscriptionApoio?: string | null
  emailApoio?: string | null
  phoneApoio?: string | null
  addressApoio?: string | null
  addressNumberApoio?: string | null
  complementApoio?: string | null
  provinceApoio?: string | null
  postalCodeApoio?: string | null
  cityIdApoio?: number | null
  stateApoio?: string | null
  cpfCnpjApoio?: string | null
  installments?: string | null
  paymentMean?: number | null
  propertyId?: string | null
  customerApoioProperty?: string | null

  constructor(props: Omit<Order, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.numberOrder = props.numberOrder
    this.createdAt = props.createdAt
    this.status = props.status
    this.discount = new Prisma.Decimal(props.discount || 0)
    this.total = new Prisma.Decimal(props.total || 0)
    this.disabledAt = props.disabledAt
    this.customerId = props.customerId
    this.shipping = new Prisma.Decimal(props.shipping || 0)
    this.employeeId = props.employeeId
    this.obs = props.obs
    this.payMethodId = props.payMethodId
    this.companyId = props.companyId
    this.budgetId = props.budgetId
    this.customerApoioId = props.customerApoioId
    this.customerApoioName = props.customerApoioName
    this.stateInscriptionApoio = props.stateInscriptionApoio
    this.emailApoio = props.emailApoio
    this.phoneApoio = props.phoneApoio
    this.addressApoio = props.addressApoio
    this.addressNumberApoio = props.addressNumberApoio
    this.complementApoio = props.complementApoio
    this.provinceApoio = props.provinceApoio
    this.postalCodeApoio = props.postalCodeApoio
    this.cityIdApoio = props.cityIdApoio
    this.stateApoio = props.stateApoio
    this.cpfCnpjApoio = props.cpfCnpjApoio
    this.installments = props.installments
    this.paymentMean = props.paymentMean
    this.propertyId = props.propertyId
    this.customerApoioProperty = props.customerApoioProperty
  }
}

export { Order }
