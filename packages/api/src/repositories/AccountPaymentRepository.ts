import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { AccountPayment } from '../entities/AccountPayment'
import { IListAccountPaymentFilters } from '../useCases/ListAccountPayment/ListAccountPaymentDTO'

class DadosAccountPayment {
  id?: string
  createdAt: Date
  value: Prisma.Decimal
  paymentMeanId: number
  bankAccountId: string
  companyId?: string | null
  bankAccountDescription?: string | null
}
export class AccountPaymentRepository {
  async update(id: string, data: Partial<AccountPayment>, prismaTransaction: PrismaTransaction) {
    return await prismaTransaction.accountPayment.update({
      where: { id },
      data,
    })
  }

  create(data: AccountPayment, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.accountPayment.create({ data })
  }

  findById(id: string) {
    return prisma.accountPayment.findUnique({
      where: { id },
    })
  }

  async list(filters: IListAccountPaymentFilters): Promise<List<DadosAccountPayment>> {
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
        bankAccountId,
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
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
      items: items.map(e => {
        return {
          id: e.id,
          createdAt: e.createdAt,
          value: e.value,
          paymentMeanId: e.paymentMeanId,
          bankAccountId: e.bankAccountId,
          companyId: e.companyId,
          bankAccountDescription: e.BankAccount.description,
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
