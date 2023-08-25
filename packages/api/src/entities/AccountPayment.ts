import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class AccountPayment {
  id?: string
  createdAt: Date
  value: Prisma.Decimal
  paymentMeanId: number
  bankAccountId: string
  companyId?: string | null

  constructor(props: Omit<AccountPayment, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.createdAt = props.createdAt
    this.value = props.value
    this.paymentMeanId = props.paymentMeanId
    this.bankAccountId = props.bankAccountId
    this.companyId = props.companyId
  }
}

export { AccountPayment }
