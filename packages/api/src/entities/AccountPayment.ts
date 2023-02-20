import { Prisma } from '@prisma/client'

class AccountPayment {
  id?: string
  createdAt: Date
  value: Prisma.Decimal
  paymentMeanId: number
  bankAccountId: string
  companyId?: string

  private constructor({ createdAt, value, paymentMeanId, bankAccountId, companyId }: AccountPayment) {
    return Object.assign(this, {
      createdAt,
      value,
      paymentMeanId,
      bankAccountId,
      companyId,
    })
  }

  static create({ createdAt, value, paymentMeanId, bankAccountId, companyId }: AccountPayment) {
    const accountPayment = new AccountPayment({
      createdAt,
      value,
      paymentMeanId,
      bankAccountId,
      companyId,
    })

    return accountPayment
  }
}

export { AccountPayment }
