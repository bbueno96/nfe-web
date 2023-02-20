import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { OrderProducts } from '../entities/OrderProducts'

export class OrderProductsRepository {
  async update(data: OrderProducts): Promise<OrderProducts> {
    return await prisma.orderProducts.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: any): Promise<OrderProducts> {
    return await prisma.orderProducts.create({ data })
  }

  async findById(id: string): Promise<OrderProducts> {
    return await prisma.orderProducts.findUnique({
      where: { id },
    })
  }

  async findByOrder(orderId: string): Promise<any[]> {
    return await prisma.orderProducts.findMany({
      where: { orderId },
      include: { Product: true },
    })
  }

  async remove(orderId: string): Promise<void> {
    await prisma.orderProducts.deleteMany({
      where: { orderId },
    })
  }

  async list(filters: any): Promise<List<OrderProducts>> {
    const { orderId, page, perPage, orderBy } = filters

    const items = await prisma.orderProducts.findMany({
      where: {
        orderId: { contains: orderId, mode: 'insensitive' },
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        orderId: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.orderProducts.count({
      where: {
        orderId: { contains: orderId },
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
