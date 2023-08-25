import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { Product } from '../entities/Product'
import { IListProductsFilters } from '../useCases/ListProducts/ListProductsDTO'

export class ProductRepository {
  update(id: string, data: Partial<Product>, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.product.update({
      where: { id },
      data,
    })
  }

  create(data: Product, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.product.create({ data })
  }

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    })
  }

  findByCod(cod: string) {
    return prisma.product.findFirst({
      where: { cod },
    })
  }

  async remove(product: Product, prismaTransaction: PrismaTransaction): Promise<void> {
    await prismaTransaction.product.update({
      where: { id: product.id },
      data: product,
    })
  }

  async list(filters: IListProductsFilters): Promise<List<Product>> {
    const { companyId, description, cod, barCode, page, perPage } = filters

    let where = {}
    where = {
      ...where,
      companyId: { equals: companyId },
      disableAt: { equals: null },
    }
    if (cod !== '') {
      where = {
        ...where,
        cod: { contains: cod, mode: 'insensitive' },
      }
    }
    if (barCode !== '') {
      where = {
        ...where,
        barCode: { contains: barCode, mode: 'insensitive' },
      }
    }
    if (description !== '') {
      where = {
        ...where,
        description: { contains: description, mode: 'insensitive' },
      }
    }
    const items = await prisma.product.findMany({
      where,
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        description: 'asc' as Prisma.SortOrder,
      },
    })

    const records = await prisma.product.count({
      where,
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
