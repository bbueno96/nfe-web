import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Brand } from '../entities/Brand'
import { IListBrandFilters } from '../useCases/ListBrand/ListBrandDTO'

export class BrandRepository {
  async update(data: Brand): Promise<Brand> {
    return await prisma.brand.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Brand): Promise<Brand> {
    return await prisma.brand.create({ data })
  }

  async findById(id: string): Promise<Brand> {
    return await prisma.brand.findUnique({
      where: { id },
    })
  }

  async remove(brand: Brand): Promise<void> {
    await prisma.brand.update({
      where: { id: brand.id },
      data: brand,
    })
  }

  async list(filters: IListBrandFilters): Promise<List<Brand>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.brand.findMany({
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

    const records = await prisma.brand.count({
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
