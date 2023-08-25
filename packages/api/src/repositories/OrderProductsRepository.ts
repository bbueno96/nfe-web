import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { OrderProducts } from '../entities/OrderProducts'

export class OrderProductsRepository {
  update(id: string, data: Partial<OrderProducts>, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.orderProducts.update({
      where: { id },
      data,
    })
  }

  create(data: OrderProducts, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.orderProducts.create({ data })
  }

  findById(id: string) {
    return prisma.orderProducts.findUnique({
      where: { id },
    })
  }

  findByOrder(orderId: string) {
    return prisma.orderProducts.findMany({
      where: { orderId },
      select: {
        id: true,
        orderId: true,
        productId: true,
        amount: true,
        unitary: true,
        total: true,
        Product: { select: { id: true, stock: true, description: true, cod: true, und: true } },
      },
      orderBy: { productId: 'asc' as Prisma.SortOrder },
    })
  }

  async remove(orderId: string): Promise<void> {
    await prisma.orderProducts.deleteMany({
      where: { orderId },
    })
  }
}
