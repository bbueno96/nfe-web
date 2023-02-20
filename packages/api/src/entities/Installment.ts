import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Installment {
  id?: string
  numeroDoc: string
  customerId?: string
  customerApoioId?: string
  customerApoioName?: string
  numberInstallment: number
  dueDate: Date
  paid: boolean
  value: Prisma.Decimal
  fine?: Prisma.Decimal
  interest?: Prisma.Decimal
  nfeId?: string
  paymentMethodId?: string
  ourNumber?: string
  digitableLine?: string
  checkNumber?: string
  checkDueDate?: Date
  checkCpfCnpj?: string
  checkName?: string
  checkAgency?: number
  checkAccount?: number
  disabledAt?: Date
  companyId: string
  createdAt?: Date
  BankRemittanceId?: string
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
  wallet?: number
  bankAccountId?: string
  bankSlip?: boolean

  private constructor({
    numeroDoc,
    customerId,
    customerApoioId,
    customerApoioName,
    numberInstallment,
    dueDate,
    paid,
    value,
    fine,
    interest,
    nfeId,
    paymentMethodId,
    ourNumber,
    digitableLine,
    checkNumber,
    checkDueDate,
    checkCpfCnpj,
    checkName,
    checkAgency,
    checkAccount,
    disabledAt,
    companyId,
    BankRemittanceId,
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
    wallet,
    bankAccountId,
    bankSlip,
  }: Installment) {
    return Object.assign(this, {
      numeroDoc,
      customerId,
      customerApoioId,
      customerApoioName,
      numberInstallment,
      dueDate,
      paid,
      value,
      fine,
      interest,
      nfeId,
      paymentMethodId,
      ourNumber,
      digitableLine,
      checkNumber,
      checkDueDate,
      checkCpfCnpj,
      checkName,
      checkAgency,
      checkAccount,
      disabledAt,
      companyId,
      BankRemittanceId,
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
      wallet,
      bankAccountId,
      bankSlip,
    })
  }

  static create({
    numeroDoc,
    customerId,
    customerApoioId,
    customerApoioName,
    numberInstallment,
    dueDate,
    paid,
    value,
    fine,
    interest,
    nfeId,
    paymentMethodId,
    ourNumber,
    digitableLine,
    checkNumber,
    checkDueDate,
    checkCpfCnpj,
    checkName,
    checkAgency,
    checkAccount,
    disabledAt,
    companyId,
    BankRemittanceId,
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
    wallet,
    bankAccountId,
    bankSlip,
  }: Installment) {
    const installment = new Installment({
      numeroDoc,
      customerId,
      customerApoioId,
      customerApoioName,
      numberInstallment,
      dueDate,
      paid,
      value,
      fine,
      interest,
      nfeId,
      paymentMethodId,
      ourNumber,
      digitableLine,
      checkNumber,
      checkDueDate,
      checkCpfCnpj,
      checkName,
      checkAgency,
      checkAccount,
      disabledAt,
      companyId,
      BankRemittanceId,
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
      wallet,
      bankAccountId,
      bankSlip,
    })

    installment.id = uuidv4()

    return installment
  }
}

export { Installment }
