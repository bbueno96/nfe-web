import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { PayMethod } from '../entities/PayMethod'
import { IListPayMethodFilters } from '../useCases/ListPayMethod/ListPayMethodDTO'

export class PayMethodsRepository {
  async update(data: PayMethod): Promise<PayMethod> {
    return await prisma.payMethod.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: PayMethod): Promise<PayMethod> {
    return await prisma.payMethod.create({ data })
  }

  async findById(id: string): Promise<any> {
    return await prisma.payMethod.findUnique({
      where: { id },
      include: { BankAccount: true },
    })
  }

  async remove(payMethod: PayMethod): Promise<void> {
    await prisma.payMethod.update({
      where: { id: payMethod.id },
      data: payMethod,
    })
  }

  async list(filters: IListPayMethodFilters): Promise<List<PayMethod>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.payMethod.findMany({
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

    const records = await prisma.payMethod.count({
      where: {
        description: { contains: description, mode: 'insensitive' },
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

  async findIbptByNcm(NCM: string): Promise<any> {
    return await prisma.ibpt.findFirst({
      where: { NCM_NBS: NCM },
    })
  }

  async findCestByNcm(NCM: string): Promise<any> {
    return await prisma.cest.findFirst({
      where: { NCM },
    })
  }
}
