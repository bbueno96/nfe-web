import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Order {
  id?: string
  numberOrder?: number
  createdAt?: Date
  status: number
  discount: Prisma.Decimal
  total: Prisma.Decimal
  customerId?: string
  shipping: Prisma.Decimal
  employeeId: string
  payMethodId?: string
  companyId: string
  obs?: string
  disabledAt?: Date
  budgetId?: string
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
  stateApoio?: string
  cpfCnpjApoio?: string

  private constructor({
    id,
    numberOrder,
    createdAt,
    status,
    discount,
    total,
    disabledAt,
    customerId,
    shipping,
    employeeId,
    obs,
    payMethodId,
    companyId,
    budgetId,
    customerApoioId,
    customerApoioName,
    stateInscriptionApoio,
    emailApoio,
    phoneApoio,
    addressApoio,
    addressNumberApoio,
    complementApoio,
    provinceApoio,
    postalCodeApoio,
    cityIdApoio,
    stateApoio,
    cpfCnpjApoio,
  }: Order) {
    return Object.assign(this, {
      id,
      numberOrder,
      createdAt,
      status,
      discount,
      total,
      disabledAt,
      customerId,
      shipping,
      employeeId,
      obs,
      payMethodId,
      companyId,
      budgetId,
      customerApoioId,
      customerApoioName,
      stateInscriptionApoio,
      emailApoio,
      phoneApoio,
      addressApoio,
      addressNumberApoio,
      complementApoio,
      provinceApoio,
      postalCodeApoio,
      cityIdApoio,
      stateApoio,
      cpfCnpjApoio,
    })
  }

  static create({
    id,
    numberOrder,
    createdAt,
    status,
    discount,
    total,
    disabledAt,
    customerId,
    shipping,
    employeeId,
    obs,
    payMethodId,
    companyId,
    budgetId,
    customerApoioId,
    customerApoioName,
    stateInscriptionApoio,
    emailApoio,
    phoneApoio,
    addressApoio,
    addressNumberApoio,
    complementApoio,
    provinceApoio,
    postalCodeApoio,
    cityIdApoio,
    stateApoio,
    cpfCnpjApoio,
  }: Order) {
    const order = new Order({
      id: id || uuidv4(),
      numberOrder,
      createdAt,
      status,
      discount,
      total,
      disabledAt,
      customerId,
      shipping,
      employeeId,
      obs,
      payMethodId,
      companyId,
      budgetId,
      customerApoioId,
      customerApoioName,
      stateInscriptionApoio,
      emailApoio,
      phoneApoio,
      addressApoio,
      addressNumberApoio,
      complementApoio,
      provinceApoio,
      postalCodeApoio,
      cityIdApoio,
      stateApoio,
      cpfCnpjApoio,
    })

    return order
  }
}

export { Order }
