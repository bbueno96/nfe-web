import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Admin } from '../entities/Admin'

export class AdminRepository {
  async findByLogin(login: string): Promise<Admin> {
    return await prisma.admin.findUnique({
      where: { login },
    })
  }

  async update(data: Admin): Promise<Admin> {
    return await prisma.admin.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Admin): Promise<Admin> {
    return await prisma.admin.create({ data })
  }

  async findById(id: string): Promise<Admin> {
    return await prisma.admin.findUnique({
      where: { id },
    })
  }

  async remove(admin: Admin): Promise<void> {
    await prisma.admin.update({
      where: { id: admin.id },
      data: admin,
    })
  }

  async list(filters: any): Promise<List<Admin>> {
    const { companyId, name, page, perPage, orderBy } = filters

    const items = await prisma.admin.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        companyId: { equals: companyId },
      },
      skip: Number((page - 1) * perPage) || undefined,
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
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
