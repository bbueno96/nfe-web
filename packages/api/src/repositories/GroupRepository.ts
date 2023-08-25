import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Group } from '../entities/Group'
import { IListGroupFilters } from '../useCases/ListGroup/ListGroupDTO'

export class GroupRepository {
  update(id: string, data: Partial<Group>) {
    return prisma.group.update({
      where: { id },
      data,
    })
  }

  create(data: Group) {
    return prisma.group.create({ data })
  }

  findById(id: string) {
    return prisma.group.findUnique({
      where: { id },
    })
  }

  async remove(group: Group): Promise<void> {
    await prisma.group.update({
      where: { id: group.id },
      data: group,
    })
  }

  async list(filters: IListGroupFilters): Promise<List<Group>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.group.findMany({
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
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
