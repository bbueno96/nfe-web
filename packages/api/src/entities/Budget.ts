import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Budget {
  id?: string
  numberBudget: number
  createdAt: Date
  status?: number | null
  discount?: Prisma.Decimal | null
  total: Prisma.Decimal
  deliveryForecast?: Date | null
  customerId?: string | null
  shipping?: Prisma.Decimal | null
  employeeId: string
  auth: boolean
  payMethodId?: string | null
  companyId?: string | null
  customerApoioId?: string | null
  customerApoioName?: string | null
  obs?: string | null
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
  disabledAt?: Date | null
  installments?: string | null
  paymentMean?: number | null
  propertyId?: string | null
  customerIdApoio?: number | null
  customerApoioProperty?: string | null

  constructor(props: Omit<Budget, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.numberBudget = props.numberBudget
    this.createdAt = props.createdAt
    this.status = props.status
    this.discount = new Prisma.Decimal(props.discount || 0)
    this.total = new Prisma.Decimal(props.total)
    this.deliveryForecast = props.deliveryForecast
    this.customerId = props.customerId
    this.shipping = new Prisma.Decimal(props.shipping || 0)
    this.employeeId = props.employeeId
    this.auth = props.auth
    this.payMethodId = props.payMethodId
    this.companyId = props.companyId
    this.customerApoioId = props.customerApoioId
    this.customerApoioName = props.customerApoioName
    this.obs = props.obs
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
    this.disabledAt = props.disabledAt
    this.installments = props.installments
    this.paymentMean = props.paymentMean
    this.propertyId = props.propertyId
    this.customerIdApoio = props.customerIdApoio
    this.customerApoioProperty = props.customerApoioProperty
  }
}

export { Budget }
