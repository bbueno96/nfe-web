import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Product } from '../entities/Product'
import { IListProductsFilters } from '../useCases/ListProducts/ListProductsDTO'

export class ProductRepository {
  async update(data: Product): Promise<Product> {
    return await prisma.product.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: any): Promise<Product> {
    return await prisma.product.create({ data })
  }

  async findById(id: string): Promise<Product> {
    return await prisma.product.findUnique({
      where: { id },
    })
  }

  async remove(product: Product): Promise<void> {
    await prisma.product.update({
      where: { id: product.id },
      data: product,
    })
  }

  async list(filters: IListProductsFilters): Promise<List<Product>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.product.findMany({
      where: {
        description: { contains: description, mode: 'insensitive' },
        companyId,
      },
      include: {
        TaxSituation: true,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        description: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.product.count({
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
