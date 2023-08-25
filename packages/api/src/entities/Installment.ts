import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Installment {
  id?: string
  numeroDoc?: string | null
  customerId?: string | null
  customerApoioId?: string | null
  customerApoioName?: string | null
  numberInstallment: number
  dueDate: Date
  paid: boolean
  value?: Prisma.Decimal | null
  fine?: Prisma.Decimal | null
  interest?: Prisma.Decimal | null
  nfeId?: string | null
  paymentMethodId?: string | null
  ourNumber?: string | null
  digitableLine?: string | null
  checkNumber?: string | null
  checkDueDate?: Date | null
  checkCpfCnpj?: string | null
  checkName?: string | null
  checkAgency?: number | null
  checkAccount?: number | null
  disabledAt?: Date | null
  companyId?: string | null
  createdAt: Date
  BankRemittanceId?: string | null
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
  wallet?: number | null
  bankAccountId?: string | null
  bankSlip?: boolean | null

  constructor(props: Omit<Installment, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.numeroDoc = props.numeroDoc
    this.customerId = props.customerId
    this.customerApoioId = props.customerApoioId
    this.customerApoioName = props.customerApoioName
    this.numberInstallment = props.numberInstallment
    this.dueDate = props.dueDate
    this.paid = props.paid
    this.value = new Prisma.Decimal(props.value || 0)
    this.fine = new Prisma.Decimal(props.fine || 0)
    this.interest = new Prisma.Decimal(props.interest || 0)
    this.nfeId = props.nfeId
    this.paymentMethodId = props.paymentMethodId
    this.ourNumber = props.ourNumber
    this.digitableLine = props.digitableLine
    this.checkNumber = props.checkNumber
    this.checkDueDate = props.checkDueDate
    this.checkCpfCnpj = props.checkCpfCnpj
    this.checkName = props.checkName
    this.checkAgency = props.checkAgency
    this.checkAccount = props.checkAccount
    this.disabledAt = props.disabledAt
    this.companyId = props.companyId
    this.BankRemittanceId = props.BankRemittanceId
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
    this.wallet = props.wallet
    this.bankAccountId = props.bankAccountId
    this.bankSlip = props.bankSlip
  }
}

export { Installment }
