import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Classification } from '../entities/Classification'

export class ClassificationRepository {
  async update(data: Classification): Promise<Classification> {
    return await prisma.classification.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Classification): Promise<Classification> {
    return await prisma.classification.create({ data })
  }

  async findById(id: string): Promise<Classification> {
    return await prisma.classification.findUnique({
      where: { id },
    })
  }

  async remove(classification: Classification): Promise<void> {
    await prisma.classification.update({
      where: { id: classification.id },
      data: { disabledAt: classification.disabledAt ? null : new Date() },
    })
  }

  async list(filters: any): Promise<List<Classification>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.classification.findMany({
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
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
