import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { ProviderProducts } from '../entities/ProviderProducts'

export class ProviderProductsRepository {
  async update(data: ProviderProducts): Promise<ProviderProducts> {
    return await prisma.providerProducts.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: ProviderProducts): Promise<ProviderProducts> {
    return await prisma.providerProducts.create({ data })
  }

  async findById(id: string): Promise<ProviderProducts> {
    return await prisma.providerProducts.findUnique({
      where: { id },
    })
  }

  async findByProvider(id: string, companyId: string): Promise<ProviderProducts> {
    return await prisma.providerProducts.findFirst({
      where: { productIdProvider: { contains: id, mode: 'insensitive' }, companyId },
    })
  }

  async remove(providerProducts: ProviderProducts): Promise<void> {
    await prisma.providerProducts.update({
      where: { id: providerProducts.id },
      data: providerProducts,
    })
  }

  async list(filters: any): Promise<List<ProviderProducts>> {
    const { companyId, description, page, perPage, orderBy } = filters

    const items = await prisma.providerProducts.findMany({
      where: {
        companyId,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
    })

    const records = await prisma.providerProducts.count({
      where: {
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
