import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { AccountPayable } from '../entities/AccountPayable'
import { IListAccountPayableFilters } from '../useCases/ListAccountPayable/ListAccountPayableDTO'

class DadosAccountPayable {
  id?: string
  createdAt: Date
  description: string
  dueDate: Date
  value: Prisma.Decimal
  discount: Prisma.Decimal
  addition: Prisma.Decimal
  numberInstallment: number
  installments: number
  providerId: string
  document?: string | null
  classificationId?: string
  disabledAt?: Date | null
  accountPaymentId?: string | null
  providerName?: string | null
  companyId?: string | null
  classificationDescription?: string | null
}
export class AccountPayableRepository {
  update(id: string, data: Partial<AccountPayable>, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.accountPayable.update({
      where: { id },
      data,
    })
  }

  create(data: AccountPayable, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.accountPayable.create({ data })
  }

  findById(id: string) {
    return prisma.accountPayable.findUnique({
      where: { id },
    })
  }

  async remove(accountPayable: AccountPayable, prismaTransaction: PrismaTransaction | null): Promise<void> {
    const connection = prismaTransaction ?? prisma
    await connection.accountPayable.update({
      where: { id: accountPayable.id },
      data: { disabledAt: new Date() },
    })
  }

  async list(filters: IListAccountPayableFilters): Promise<List<DadosAccountPayable>> {
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
        document,
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
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
      items: items.map(e => {
        return {
          id: e.id,
          createdAt: e.createdAt,
          description: e.description,
          dueDate: e.dueDate,
          value: e.value,
          discount: e.discount,
          addition: e.addition,
          numberInstallment: e.numberInstallment,
          installments: e.installments,
          providerId: e.providerId,
          document: e.document,
          classificationId: e.classificationId,
          disabledAt: e.disabledAt,
          accountPaymentId: e.accountPaymentId,
          providerName: e.providerName,
          companyId: e.companyId,
          classificationDescription: e.Classification.description,
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
