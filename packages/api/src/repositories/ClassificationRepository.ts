import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Classification } from '../entities/Classification'
import { IListClassificationFilters } from '../useCases/ListClassification/ListClassificationDTO'

export class ClassificationRepository {
  update(id: string, data: Partial<Classification>) {
    return prisma.classification.update({
      where: { id },
      data,
    })
  }

  create(data: Classification) {
    return prisma.classification.create({ data })
  }

  findById(id: string) {
    return prisma.classification.findUnique({
      where: { id },
    })
  }

  async remove(classification: Classification): Promise<void> {
    await prisma.classification.update({
      where: { id: classification.id },
      data: { disabledAt: classification.disabledAt ? null : new Date() },
    })
  }

  async list(filters: IListClassificationFilters): Promise<List<Classification>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.classification.findMany({
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

    const records = await prisma.classification.count({
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
