import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Budget } from '../entities/Budget'
import { IListBudgetFilters } from '../useCases/ListBudget/ListBudgetDTO'

export class BudgetRepository {
  async update(data: Budget): Promise<Budget> {
    return await prisma.budget.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Budget): Promise<Budget> {
    return await prisma.budget.create({ data })
  }

  async findById(id: string): Promise<any> {
    return await prisma.budget.findUnique({
      where: { id },
      include: { Customer: true, BudgetProducts: true, Admin: true, PayMethod: true },
    })
  }

  async hasOrderConfirmed(id: string): Promise<boolean> {
    const count = await prisma.order.count({ where: { budgetId: id, disabledAt: null } })
    return count > 0
  }

  async remove(budget: Budget): Promise<void> {
    await prisma.budget.update({
      where: { id: budget.id },
      data: budget,
    })
  }

  async list(filters: IListBudgetFilters): Promise<List<any>> {
    const { companyId, customer, page, perPage, orderBy } = filters

    const items = await prisma.budget.findMany({
      where: {
        customerId: { contains: customer, mode: 'insensitive' },
        companyId,
      },
      include: {
        Customer: true,
        PayMethod: true,
        BudgetProducts: true,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        numberBudget: 'desc',
      },
    })

    const records = await prisma.budget.count({
      where: {
        customerId: { contains: customer, mode: 'insensitive' },
        companyId,
      },
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
