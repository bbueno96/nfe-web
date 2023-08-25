import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Provider } from '../entities/Provider'
import { IListProvidersFilters } from '../useCases/ListProviders/ListProvidersDTO'

export class ProviderRepository {
  async hasCnpj(cpfCnpj: string, companyId: string): Promise<boolean> {
    const count = await prisma.provider.count({ where: { cpfCnpj, companyId } })
    return count > 0
  }

  update(id: string, data: Partial<Provider>) {
    return prisma.provider.update({
      where: { id },
      data,
    })
  }

  create(data: Provider) {
    return prisma.provider.create({ data })
  }

  findById(id: string) {
    return prisma.provider.findUnique({
      where: { id },
    })
  }

  findByCnpj(CNPJ: string, company: string) {
    return prisma.provider.findFirst({
      where: { cpfCnpj: CNPJ, companyId: company },
    })
  }

  async remove(provider: Provider): Promise<void> {
    await prisma.provider.update({
      where: { id: provider.id },
      data: provider,
    })
  }

  async list(filters: IListProvidersFilters): Promise<List<Provider>> {
    const { companyId, cpfCnpj, name, page, perPage } = filters

    const items = await prisma.provider.findMany({
      where: {
        cpfCnpj: { contains: cpfCnpj },
        name: { contains: name, mode: 'insensitive' },
        companyId,
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        name: 'asc' as Prisma.SortOrder,
      },
    })

    const records = await prisma.provider.count({
      where: {
        cpfCnpj: { contains: cpfCnpj },
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

  async listOutro(filters: IListProvidersFilters): Promise<List<Provider>> {
    const { companyId, cpfCnpj, name, page, perPage } = filters

    const items = await prisma.provider.findMany({
      where: {
        cpfCnpj: { contains: cpfCnpj },
        name: { contains: name, mode: 'insensitive' },
        companyId,
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        name: 'asc' as Prisma.SortOrder,
      },
    })

    const records = await prisma.provider.count({
      where: {
        cpfCnpj: { contains: cpfCnpj },
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
