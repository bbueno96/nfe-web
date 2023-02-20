import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Budget {
  id?: string
  numberBudget: number
  createdAt: Date
  status: number
  discount: Prisma.Decimal
  total: Prisma.Decimal
  deliveryForecast: Date
  customerId: string
  shipping: Prisma.Decimal
  employeeId: string
  auth: boolean
  payMethodId?: string
  companyId?: string
  customerApoioId?: string
  customerApoioName?: string
  obs?: string
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
  disabledAt?: Date

  private constructor({
    id,
    numberBudget,
    createdAt,
    status,
    discount,
    total,
    deliveryForecast,
    customerId,
    shipping,
    employeeId,
    auth,
    payMethodId,
    companyId,
    customerApoioId,
    customerApoioName,
    obs,
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
    disabledAt,
  }: Budget) {
    return Object.assign(this, {
      id,
      numberBudget,
      createdAt,
      status,
      discount,
      total,
      deliveryForecast,
      customerId,
      shipping,
      employeeId,
      auth,
      payMethodId,
      companyId,
      customerApoioId,
      customerApoioName,
      obs,
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
      disabledAt,
    })
  }

  static create({
    id,
    numberBudget,
    createdAt,
    status,
    discount,
    total,
    deliveryForecast,
    customerId,
    shipping,
    employeeId,
    auth,
    payMethodId,
    companyId,
    customerApoioId,
    customerApoioName,
    obs,
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
    disabledAt,
  }: Budget) {
    const budget = new Budget({
      numberBudget,
      createdAt,
      status,
      discount,
      total,
      deliveryForecast,
      customerId,
      shipping,
      employeeId,
      auth,
      payMethodId,
      companyId,
      customerApoioId,
      customerApoioName,
      obs,
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
      disabledAt,
      id: id || uuidv4(),
    })

    return budget
  }

  static update({
    id,
    numberBudget,
    createdAt,
    status,
    discount,
    total,
    deliveryForecast,
    customerId,
    shipping,
    employeeId,
    auth,
    payMethodId,
    companyId,
    customerApoioId,
    customerApoioName,
    obs,
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
    disabledAt,
  }: Budget) {
    const budget = new Budget({
      id,
      numberBudget,
      createdAt,
      status,
      discount,
      total,
      deliveryForecast,
      customerId,
      shipping,
      employeeId,
      auth,
      payMethodId,
      companyId,
      customerApoioId,
      customerApoioName,
      obs,
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
      disabledAt,
    })

    return budget
  }
}

export { Budget }
