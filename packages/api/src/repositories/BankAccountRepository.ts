import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { BankAccount } from '../entities/BankAccount'

export class BankAccountRepository {
  async update(data: BankAccount): Promise<BankAccount> {
    return await prisma.bankAccount.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: BankAccount): Promise<BankAccount> {
    return await prisma.bankAccount.create({ data })
  }

  async findById(id: string): Promise<BankAccount> {
    return await prisma.bankAccount.findUnique({
      where: { id },
    })
  }

  async remove(bankAccount: BankAccount): Promise<void> {
    await prisma.bankAccount.update({
      where: { id: bankAccount.id },
      data: { disabledAt: new Date() },
    })
  }

  async list(filters: any): Promise<List<BankAccount>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.bankAccount.findMany({
      where: {
        description: { contains: description, mode: 'insensitive' },
        companyId,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        description: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.bankAccount.count({
      where: {
        description: { contains: description },
        companyId,
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
