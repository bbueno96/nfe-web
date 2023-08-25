import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Brand } from '../entities/Brand'
import { IListBrandFilters } from '../useCases/ListBrand/ListBrandDTO'

export class BrandRepository {
  update(id: string, data: Partial<Brand>) {
    return prisma.brand.update({
      where: { id },
      data,
    })
  }

  create(data: Brand) {
    return prisma.brand.create({ data })
  }

  findById(id: string) {
    return prisma.brand.findUnique({
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
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
