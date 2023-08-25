import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class PayMethod {
  id?: string
  description: string
  fine?: Prisma.Decimal | null
  interest?: Prisma.Decimal | null
  dueDay: number
  numberInstallments: number
  bankAccountId?: string | null
  bankSlip: boolean
  wallet?: number | null
  createdAt: Date
  disableAt?: Date | null
  generateInstallmens: boolean
  companyId?: string | null

  constructor(props: Omit<PayMethod, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.description = props.description
    this.fine = new Prisma.Decimal(props.fine || 0)
    this.interest = new Prisma.Decimal(props.interest || 0)
    this.dueDay = props.dueDay
    this.numberInstallments = props.numberInstallments
    this.bankAccountId = props.bankAccountId
    this.bankSlip = props.bankSlip
    this.wallet = props.wallet
    this.disableAt = props.disableAt
    this.companyId = props.companyId
    this.generateInstallmens = props.generateInstallmens
  }
}

export { PayMethod }
