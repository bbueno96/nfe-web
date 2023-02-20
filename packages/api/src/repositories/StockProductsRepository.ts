import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { StockProducts } from '../entities/StockProducts'

export class StockProductsRepository {
  async update(data: StockProducts): Promise<StockProducts> {
    return await prisma.stockProducts.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: StockProducts): Promise<StockProducts> {
    return await prisma.stockProducts.create({ data })
  }

  async findById(id: string): Promise<StockProducts> {
    return await prisma.stockProducts.findUnique({
      where: { id },
    })
  }

  async remove(notaId: string): Promise<void> {
    await prisma.stockProducts.deleteMany({
      where: { generateId: notaId },
    })
  }

  async list(filters: any): Promise<List<StockProducts>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.stockProducts.findMany({
      where: {
        numeroDoc: { contains: description, mode: 'insensitive' },
        companyId,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        numeroDoc: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.stockProducts.count({
      where: {
        numeroDoc: { contains: description },
        companyId,
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
