import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Group } from '../entities/Group'

export class GroupRepository {
  async update(data: Group): Promise<Group> {
    return await prisma.group.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Group): Promise<Group> {
    return await prisma.group.create({ data })
  }

  async findById(id: string): Promise<Group> {
    return await prisma.group.findUnique({
      where: { id },
    })
  }

  async remove(group: Group): Promise<void> {
    await prisma.group.update({
      where: { id: group.id },
      data: group,
    })
  }

  async list(filters: any): Promise<List<Group>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.group.findMany({
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

    const records = await prisma.group.count({
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
}
