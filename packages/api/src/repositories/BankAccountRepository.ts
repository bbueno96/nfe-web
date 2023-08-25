import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { BankAccount } from '../entities/BankAccount'
import { IListBankAccountFilters } from '../useCases/ListBankAccount/ListBankAccountDTO'

export class BankAccountRepository {
  update(id: string, data: Partial<BankAccount>, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.bankAccount.update({
      where: { id },
      data,
    })
  }

  create(data: BankAccount, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.bankAccount.create({ data })
  }

  async findById(id: string) {
    return await prisma.bankAccount.findUnique({
      where: { id },
    })
  }

  async remove(bankAccount: BankAccount, prismaTransaction: PrismaTransaction): Promise<void> {
    await prismaTransaction.bankAccount.update({
      where: { id: bankAccount.id },
      data: { disabledAt: new Date() },
    })
  }

  async list(filters: IListBankAccountFilters): Promise<List<BankAccount>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.bankAccount.findMany({
      where: {
        description: { contains: description, mode: 'insensitive' },
        companyId,
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
