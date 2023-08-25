import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { Budget } from '../entities/Budget'
import { IListBudgetFilters } from '../useCases/ListBudget/ListBudgetDTO'

class DadosBudget {
  numberBudget: number
  id: string
  customerName?: string | null
  cpfCnpj?: string | null
  createdAt: Date
  status?: number | null
  deliveryForecast?: Date | null
  auth: boolean
  total: Prisma.Decimal
  payMethodName: string
  installments: string
  paymentMean: number
  customerApoioProperty?: string | null
}

export class BudgetRepository {
  update(id: string, data: Partial<Budget>, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.budget.update({
      where: { id },
      data,
    })
  }

  create(data: Budget, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.budget.create({ data })
  }

  findById(id: string) {
    return prisma.budget.findUnique({
      where: { id },
      include: {
        Customer: true,
        Admin: true,
        PayMethod: true,
        BudgetProducts: {
          select: {
            id: true,
            budgetId: true,
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

  async hasOrderConfirmed(id: string): Promise<boolean> {
    const count = await prisma.order.count({ where: { budgetId: id, disabledAt: null } })
    return count > 0
  }

  async remove(budget: Budget, prismaTransaction: PrismaTransaction | null): Promise<void> {
    const connection = prismaTransaction ?? prisma
    await connection.budget.update({
      where: { id: budget.id },
      data: budget,
    })
  }

  async list(filters: IListBudgetFilters): Promise<List<DadosBudget>> {
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

    const items = await prisma.budget.findMany({
      where,
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        numberBudget: 'desc',
      },
      include: {
        Customer: true,
        PayMethod: true,
        BudgetProducts: true,
      },
    })
    const records = await prisma.budget.count({
      where,
    })

    return {
      items: items.map(i => {
        return {
          numberBudget: i.numberBudget,
          id: i.id,
          customerName: i.Customer ? i.Customer.name : i.customerApoioName,
          cpfCnpj: i.Customer ? i.Customer.cpfCnpj : i.cpfCnpjApoio,
          createdAt: i.createdAt,
          status: i.status,
          deliveryForecast: i.deliveryForecast,
          auth: i.auth,
          total: i.total,
          payMethodName: i.PayMethod ? i.PayMethod.description : '',
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
