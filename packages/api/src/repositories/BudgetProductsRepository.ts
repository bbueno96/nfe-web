import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { BudgetProducts } from '../entities/BudgetProducts'

export class BudgetProductsRepository {
  async update(data: BudgetProducts): Promise<BudgetProducts> {
    return await prisma.budgetProducts.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: any): Promise<BudgetProducts> {
    return await prisma.budgetProducts.create({ data })
  }

  async findById(id: string): Promise<BudgetProducts> {
    return await prisma.budgetProducts.findUnique({
      where: { id },
      include: { Product: true },
    })
  }

  async findByBudget(budgetId: string): Promise<any[]> {
    return await prisma.budgetProducts.findMany({
      where: { budgetId },
      include: { Product: true },
    })
  }

  async remove(budgetId: string): Promise<void> {
    await prisma.budgetProducts.deleteMany({
      where: { budgetId },
    })
  }

  async list(filters: any): Promise<List<BudgetProducts>> {
    const { budgetId, page, perPage, orderBy } = filters

    const items = await prisma.budgetProducts.findMany({
      where: {
        budgetId: { contains: budgetId, mode: 'insensitive' },
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        budgetId: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.budgetProducts.count({
      where: {
        budgetId: { contains: budgetId },
      },
    })

    return {
      items,
      pager: {
        records,
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
