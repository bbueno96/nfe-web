import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { Order } from '../entities/Order'
import { IListOrderFilters } from '../useCases/ListOrder/ListOrderDTO'

class DadosOrder {
  numberOrder: number
  id: string
  customerName?: string | null
  cpfCnpj?: string | null
  createdAt: Date
  status?: number | null
  deliveryForecast?: Date | null
  budgetId?: string | null
  numberBudget?: number | null
  total: Prisma.Decimal
  payMethodName: string
  installments: string
  paymentMean: number
  customerApoioProperty?: string | null
}

export class OrderRepository {
  async hasNfeAuth(id: string): Promise<boolean> {
    const count = await prisma.nfe.count({ where: { orderId: id, status: 'Autorizado' } })
    return count > 0
  }

  update(id: string, data: Partial<Order>, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.order.update({
      where: { id },
      data,
    })
  }

  create(data, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.order.create({ data })
  }

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        Customer: true,
        Admin: true,
        PayMethod: true,
        OrderProducts: {
          select: {
            id: true,
            orderId: true,
            productId: true,
            amount: true,
            unitary: true,
            total: true,
            Product: { select: { id: true, stock: true, description: true, cod: true, und: true } },
          },
        },
      },
    })
  }

  async remove(order: Order, prismaTransaction: PrismaTransaction | null): Promise<void> {
    const connection = prismaTransaction ?? prisma
    await connection.order.update({
      where: { id: order.id },
      data: order,
    })
  }

  async list(filters: IListOrderFilters): Promise<List<DadosOrder>> {
    const { companyId, customer, name, cpfCnpj, customerApoioProperty, page, perPage } = filters
    let where = {}
    where = {
      ...where,
      companyId: { equals: companyId },
    }
    if (cpfCnpj) {
      where = {
        ...where,
        cpfCnpjApoio: { contains: cpfCnpj },
      }
    }
    if (name) {
      where = {
        ...where,
        customerApoioName: { contains: name, mode: 'insensitive' },
      }
    }
    if (customerApoioProperty) {
      where = {
        ...where,
        customerApoioProperty: { contains: customerApoioProperty, mode: 'insensitive' },
      }
    }
    if (customer) {
      where = {
        ...where,
        customerId: { contains: customer, mode: 'insensitive' },
      }
    }

    const items = await prisma.order.findMany({
      where,
      include: {
        Customer: true,
        PayMethod: true,
        Budget: true,
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        numberOrder: 'desc',
      },
    })

    const records = await prisma.order.count({
      where,
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
          numberBudget: i.Budget ? i.Budget.numberBudget : 0,
          installments: i.installments ? i.installments : '',
          paymentMean: i.paymentMean ? i.paymentMean : 1,
          customerApoioProperty: i.customerApoioProperty,
        }
      }),
      pager: {
        records,
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
