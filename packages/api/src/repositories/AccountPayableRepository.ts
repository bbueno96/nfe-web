import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { AccountPayable } from '../entities/AccountPayable'

export class AccountPayableRepository {
  async update(data: AccountPayable): Promise<AccountPayable> {
    return await prisma.accountPayable.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: AccountPayable): Promise<AccountPayable> {
    return await prisma.accountPayable.create({ data })
  }

  async findById(id: string): Promise<AccountPayable> {
    return await prisma.accountPayable.findUnique({
      where: { id },
    })
  }

  async remove(accountPayable: AccountPayable): Promise<void> {
    await prisma.accountPayable.update({
      where: { id: accountPayable.id },
      data: { disabledAt: new Date() },
    })
  }

  async list(filters: any): Promise<List<any>> {
    const {
      minCreatedAtDate,
      maxCreatedAtDate,
      minDueDate,
      maxDueDate,
      providerId,
      document,
      isPaid,
      companyId,
      page,
      perPage,
      orderBy,
    } = filters
    let where = {}
    where = {
      ...where,
      companyId,
    }
    if (minCreatedAtDate && maxCreatedAtDate) {
      where = {
        ...where,
        createdAt: {
          gte: minCreatedAtDate,
          lte: maxCreatedAtDate,
        },
      }
    }
    if (minDueDate && maxDueDate) {
      where = {
        ...where,
        dueDate: {
          gte: minDueDate,
          lte: maxDueDate,
        },
      }
    }
    if (providerId) {
      where = {
        ...where,
        providerId,
      }
    }
    if (document) {
      where = {
        ...where,
        document: { contains: document, mode: 'insensitive' },
      }
    }
    if (isPaid !== null) {
      where = {
        ...where,
        isPaid,
      }
    }
    const items = await prisma.accountPayable.findMany({
      where,
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        description: orderBy as Prisma.SortOrder,
      },
      include: {
        Classification: {
          select: {
            description: true,
          },
        },
      },
    })

    const records = await prisma.accountPayable.count({
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
