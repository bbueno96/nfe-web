import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Order } from '../entities/Order'
import { IListOrderFilters } from '../useCases/ListOrder/ListOrderDTO'

export class OrderRepository {
  async hasNfeAuth(id: string): Promise<boolean> {
    const count = await prisma.nfe.count({ where: { orderId: id, status: 'Autorizado' } })
    return count > 0
  }

  async update(data: Order): Promise<Order> {
    return await prisma.order.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data): Promise<Order> {
    return await prisma.order.create({ data })
  }

  async findById(id: string): Promise<any> {
    return await prisma.order.findUnique({
      where: { id },
      include: { Customer: true, OrderProducts: true, Admin: true, PayMethod: true },
    })
  }

  async remove(order: Order): Promise<void> {
    await prisma.order.update({
      where: { id: order.id },
      data: order,
    })
  }

  async list(filters: IListOrderFilters): Promise<List<any>> {
    const { companyId, customer, page, perPage, orderBy } = filters

    const items = await prisma.order.findMany({
      where: {
        customerId: { contains: customer, mode: 'insensitive' },
        companyId,
      },
      include: {
        Customer: true,
        PayMethod: true,
        Budget: true,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        numberOrder: 'desc',
      },
    })

    const records = await prisma.order.count({
      where: {
        customerId: { contains: customer, mode: 'insensitive' },
        companyId,
      },
    })

    return {
      items: items.map(i => {
        return {
          numberOrder: i.numberOrder,
          id: i.id,
          customerName: i.Customer ? i.Customer.name : i.customerApoioName,
          cpfCnpj: i.Customer ? i.Customer.cpfCnpj : i.cpfCnpjApoio,
          createdAt: i.createdAt,
          status: i.status,
          total: i.total,
          payMethodName: i.PayMethod ? i.PayMethod.description : '',
          budgetId: i.budgetId,
          numberBudget: i.Budget ? i.Budget.numberBudget : '',
        }
      }),
      pager: {
        records,
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
