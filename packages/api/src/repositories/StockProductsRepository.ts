import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { StockProducts } from '../entities/StockProducts'

export class StockProductsRepository {
  update(id: string, data: Partial<StockProducts>, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.stockProducts.update({
      where: { id },
      data,
    })
  }

  create(data: StockProducts, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.stockProducts.create({ data })
  }

  findById(id: string) {
    return prisma.stockProducts.findUnique({
      where: { id },
    })
  }

  findByProduct(productId: string, companyId: string) {
    return prisma.stockProducts.findMany({
      where: { productId, companyId },
      orderBy: { createdAt: 'desc' as Prisma.SortOrder },
    })
  }

  async remove(notaId: string, prismaTransaction: PrismaTransaction): Promise<void> {
    await prismaTransaction.stockProducts.deleteMany({
      where: { generateId: notaId },
    })
  }
}
