import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Nfe } from '../entities/Nfe'
import { Product } from '../entities/Product'
import { IListNfeFilters } from '../useCases/ListNfe/ListNfeDTO'

export class NfeRepository {
  async update(data: Nfe): Promise<Nfe> {
    return await prisma.nfe.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Nfe): Promise<Nfe> {
    return await prisma.nfe.create({ data })
  }

  async createNfeStorage(data): Promise<any> {
    return await prisma.nfeStorege.create({ data })
  }

  async findById(id: string): Promise<Nfe> {
    return await prisma.nfe.findUnique({
      where: { id },
      include: {
        NfeProduto: true,
      },
    })
  }

  async findByIdP(id: string): Promise<Nfe> {
    return await prisma.nfe.findUnique({
      where: { id },
    })
  }

  async remove(nfe: Nfe): Promise<void> {
    await prisma.nfe.update({
      where: { id: nfe.id },
      data: nfe,
    })
  }

  async getXmlNota(chave: string): Promise<any> {
    return await prisma.nfeStorege.findFirst({
      where: { nome: chave },
    })
  }

  async list(filters: IListNfeFilters): Promise<List<Nfe>> {
    const { companyId, name, page, perPage, orderBy, tipo } = filters
    let where = {}
    where = {
      ...where,
      companyId: { equals: companyId },
    }
    if (name) {
      where = {
        ...where,
        razaoSocial: { contains: name, mode: 'insensitive' },
      }
    }
    if (tipo) {
      where = {
        ...where,
        tipo: { contains: tipo, mode: 'insensitive' },
      }
    }
    const items = await prisma.nfe.findMany({
      where,
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        numeroNota: 'desc',
      },
    })

    const records = await prisma.nfe.count({
      where,
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
