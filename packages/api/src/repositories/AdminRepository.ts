import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Admin } from '../entities/Admin'
import { IListAdminsFilters } from '../useCases/ListAdmins/ListAdminsDTO'

export class AdminRepository {
  findByLogin(login: string) {
    return prisma.admin.findUnique({
      where: { login },
    })
  }

  update(id: string, data: Partial<Admin>) {
    return prisma.admin.update({
      where: { id },
      data,
    })
  }

  create(data: Admin) {
    return prisma.admin.create({ data })
  }

  findById(id: string) {
    return prisma.admin.findUnique({
      where: { id },
    })
  }

  async remove(admin: Admin): Promise<void> {
    await prisma.admin.update({
      where: { id: admin.id },
      data: admin,
    })
  }

  async list(filters: IListAdminsFilters): Promise<List<Admin>> {
    const { companyId, name, page, perPage, orderBy } = filters

    const items = await prisma.admin.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        companyId: { equals: companyId },
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        name: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.admin.count({
      where: {
        name: { contains: name, mode: 'insensitive' },
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
