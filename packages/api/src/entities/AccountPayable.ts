import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class AccountPayable {
  id?: string
  createdAt: Date
  description: string
  dueDate: Date
  value: Prisma.Decimal
  discount: Prisma.Decimal
  addition: Prisma.Decimal
  numberInstallment: number
  installments: number
  providerId: string
  document?: string | null
  classificationId: string
  disabledAt?: Date | null
  accountPaymentId?: string | null
  providerName?: string | null
  companyId?: string | null

  constructor(props: Omit<AccountPayable, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.createdAt = props.createdAt
    this.description = props.description
    this.dueDate = props.dueDate
    this.value = props.value
    this.discount = props.discount
    this.addition = props.addition
    this.numberInstallment = props.numberInstallment
    this.installments = props.installments
    this.providerId = props.providerId
    this.document = props.document
    this.classificationId = props.classificationId
    this.accountPaymentId = props.accountPaymentId
    this.providerName = props.providerName
    this.companyId = props.companyId
  }
}

export { AccountPayable }
