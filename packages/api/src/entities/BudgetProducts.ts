import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class BudgetProducts {
  id?: string
  budgetId: string
  productId: string
  amount: Prisma.Decimal
  unitary: Prisma.Decimal
  total: Prisma.Decimal
  companyId: string

  private constructor({ budgetId, productId, amount, unitary, total, companyId }: BudgetProducts) {
    return Object.assign(this, {
      budgetId,
      productId,
      amount,
      unitary,
      total,
      companyId,
    })
  }

  static create({ budgetId, productId, amount, unitary, total, companyId }: BudgetProducts) {
    const budgetProducts = new BudgetProducts({
      budgetId,
      productId,
      amount,
      unitary,
      total,
      companyId,
    })

    budgetProducts.id = uuidv4()

    return budgetProducts
  }
}

export { BudgetProducts }
