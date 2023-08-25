import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { PayMethod } from '../entities/PayMethod'
import { IListPayMethodFilters } from '../useCases/ListPayMethod/ListPayMethodDTO'

export class PayMethodsRepository {
  update(id: string, data: Partial<PayMethod>) {
    return prisma.payMethod.update({
      where: { id },
      data,
    })
  }

  create(data: PayMethod) {
    return prisma.payMethod.create({ data })
  }

  findById(id: string) {
    return prisma.payMethod.findUnique({
      where: { id },
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
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }

  findIbptByNcm(NCM: string) {
    return prisma.ibpt.findFirst({
      where: { NCM_NBS: NCM },
    })
  }

  findCestByNcm(NCM: string) {
    return prisma.cest.findFirst({
      where: { NCM },
    })
  }
}
