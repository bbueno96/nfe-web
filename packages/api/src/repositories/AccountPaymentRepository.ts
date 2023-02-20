import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { AccountPayment } from '../entities/AccountPayment'

export class AccountPaymentRepository {
  async update(data: AccountPayment): Promise<AccountPayment> {
    return await prisma.accountPayment.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: AccountPayment): Promise<AccountPayment> {
    return await prisma.accountPayment.create({ data })
  }

  async findById(id: string): Promise<AccountPayment> {
    return await prisma.accountPayment.findUnique({
      where: { id },
    })
  }

  async list(filters: any): Promise<List<any>> {
    const { companyId, bankAccountId, maxDueDate, minDueDate, paymentMeanId, page, perPage, orderBy } = filters

    let where = {}
    where = {
      ...where,
      companyId: { equals: companyId },
    }
    if (minDueDate && maxDueDate) {
      where = {
        ...where,
        createdAt: {
          gte: minDueDate,
          lte: maxDueDate,
        },
      }
    }
    if (bankAccountId) {
      where = {
        ...where,
        bankAccountId: { contains: bankAccountId, mode: 'insensitive' },
      }
    }
    if (paymentMeanId) {
      where = {
        ...where,
        paymentMeanId: { contains: paymentMeanId, mode: 'insensitive' },
      }
    }

    const items = await prisma.accountPayment.findMany({
      where,
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        bankAccountId: orderBy as Prisma.SortOrder,
      },
      include: {
        BankAccount: true,
      },
    })

    const records = await prisma.accountPayment.count({
      where,
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
