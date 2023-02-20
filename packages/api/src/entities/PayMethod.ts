import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class PayMethod {
  id?: string
  description: string
  fine: Prisma.Decimal
  interest: Prisma.Decimal
  dueDay: number
  numberInstallments: number
  bankAccountId: string
  bankSlip: boolean
  wallet?: number
  createdAt?: Date
  disableAt?: Date
  generateInstallmens?: boolean
  companyId: string

  private constructor({
    description,
    fine,
    interest,
    dueDay,
    numberInstallments,
    bankAccountId,
    bankSlip,
    wallet,
    disableAt,
    companyId,
    generateInstallmens,
  }: PayMethod) {
    return Object.assign(this, {
      description,
      fine,
      interest,
      dueDay,
      numberInstallments,
      bankAccountId,
      bankSlip,
      wallet,
      disableAt,
      companyId,
      generateInstallmens,
    })
  }

  static create({
    description,
    fine,
    interest,
    dueDay,
    numberInstallments,
    bankAccountId,
    bankSlip,
    wallet,
    disableAt,
    companyId,
    generateInstallmens,
  }: PayMethod) {
    const payMethod = new PayMethod({
      description,
      fine,
      interest,
      dueDay,
      numberInstallments,
      bankAccountId,
      bankSlip,
      wallet,
      disableAt,
      companyId,
      generateInstallmens,
    })

    payMethod.id = uuidv4()

    return payMethod
  }
}

export { PayMethod }
