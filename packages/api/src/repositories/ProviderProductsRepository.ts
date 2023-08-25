import { prisma } from '../database/client'
import { ProviderProducts } from '../entities/ProviderProducts'
import { IListProvidersFilters } from '../useCases/ListProviders/ListProvidersDTO'

export class ProviderProductsRepository {
  update(id: string, data: Partial<ProviderProducts>) {
    return prisma.providerProducts.update({
      where: { id },
      data,
    })
  }

  create(data: ProviderProducts) {
    return prisma.providerProducts.create({ data })
  }

  findById(id: string) {
    return prisma.providerProducts.findUnique({
      where: { id },
    })
  }

  findByProvider(id: string, companyId: string) {
    return prisma.providerProducts.findFirst({
      where: { productIdProvider: { contains: id, mode: 'insensitive' }, companyId },
    })
  }

  async remove(providerProducts: ProviderProducts): Promise<void> {
    await prisma.providerProducts.update({
      where: { id: providerProducts.id },
      data: providerProducts,
    })
  }

  async list(filters: IListProvidersFilters): Promise<List<ProviderProducts>> {
    const { companyId, page, perPage } = filters

    const items = await prisma.providerProducts.findMany({
      where: {
        companyId,
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
