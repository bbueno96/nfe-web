import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { BudgetProducts } from '../entities/BudgetProducts'
import { IListBudgetFilters } from '../useCases/ListBudget/ListBudgetDTO'

export class BudgetProductsRepository {
  update(id: string, data: Partial<BudgetProducts>, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.budgetProducts.update({
      where: { id },
      data,
    })
  }

  create(data: BudgetProducts, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.budgetProducts.create({ data })
  }

  findById(id: string) {
    return prisma.budgetProducts.findUnique({
      where: { id },
      select: {
        id: true,
        budgetId: true,
        productId: true,
        amount: true,
        unitary: true,
        total: true,
        Product: { select: { id: true, stock: true, description: true, cod: true } },
      },
    })
  }

  findByBudget(budgetId: string) {
    return prisma.budgetProducts.findMany({
      where: { budgetId },
      select: {
        id: true,
        budgetId: true,
        productId: true,
        amount: true,
        unitary: true,
        total: true,
        Product: { select: { id: true, stock: true, description: true, cod: true, und: true } },
      },
      orderBy: { productId: 'asc' as Prisma.SortOrder },
    })
  }

  async remove(budgetId: string, prismaTransaction: PrismaTransaction): Promise<void> {
    await prismaTransaction.budgetProducts.deleteMany({
      where: { budgetId },
    })
  }

  async list(filters: IListBudgetFilters): Promise<List<BudgetProducts>> {
    const { budgetId, page, perPage, orderBy } = filters

    const items = await prisma.budgetProducts.findMany({
      where: {
        budgetId: { contains: budgetId, mode: 'insensitive' },
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
