import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class BudgetProducts {
  id?: string
  budgetId?: string | null
  productId?: string | null
  amount?: Prisma.Decimal | null
  unitary?: Prisma.Decimal | null
  total?: Prisma.Decimal | null
  companyId?: string | null

  constructor(props: Omit<BudgetProducts, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.budgetId = props.budgetId
    this.productId = props.productId
    this.amount = new Prisma.Decimal(props.amount || 0)
    this.unitary = new Prisma.Decimal(props.unitary || 0)
    this.total = new Prisma.Decimal(props.total || 0)
    this.companyId = props.companyId
  }
}

export { BudgetProducts }
