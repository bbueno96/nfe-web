import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Provider } from '../entities/Provider'
import { IListProvidersFilters } from '../useCases/ListProviders/ListProvidersDTO'

export class ProviderRepository {
  async hasCnpj(cpfCnpj: string): Promise<boolean> {
    const count = await prisma.provider.count({ where: { cpfCnpj } })
    return count > 0
  }

  async update(data: Provider): Promise<Provider> {
    return await prisma.provider.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Provider): Promise<Provider> {
    return await prisma.provider.create({ data })
  }

  async findById(id: string): Promise<Provider> {
    return await prisma.provider.findUnique({
      where: { id },
    })
  }

  async findByCnpj(CNPJ: string, company: string): Promise<Provider> {
    return await prisma.provider.findFirst({
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
    const { companyId, cpfCnpj, name, page, perPage, orderBy } = filters

    const items = await prisma.provider.findMany({
      where: {
        cpfCnpj: { contains: cpfCnpj },
        name: { contains: name, mode: 'insensitive' },
        companyId,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        dateCreated: orderBy as Prisma.SortOrder,
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
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }

  async listOutro(filters: IListProvidersFilters): Promise<List<Provider>> {
    const { companyId, cpfCnpj, name, page, perPage, orderBy } = filters

    const items = await prisma.provider.findMany({
      where: {
        cpfCnpj: { contains: cpfCnpj },
        name: { contains: name, mode: 'insensitive' },
        companyId,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        dateCreated: orderBy as Prisma.SortOrder,
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
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
