import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { NfeProducts } from '../entities/NfeProducts'

export class NfeProductsRepository {
  async update(data: NfeProducts): Promise<NfeProducts> {
    return await prisma.nfeProduto.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: any): Promise<NfeProducts> {
    return await prisma.nfeProduto.create({ data })
  }

  async findById(id: string): Promise<NfeProducts> {
    return await prisma.nfeProduto.findUnique({
      where: { id },
    })
  }

  async findByNfe(nota: string): Promise<any[]> {
    return await prisma.nfeProduto.findMany({
      where: { nota },
    })
  }

  async remove(id: string): Promise<void> {
    await prisma.$queryRaw`DELETE FROM nfe_produto WHERE "produto" = ${id}`
  }

  async list(filters: any): Promise<List<NfeProducts>> {
    const { name, page, perPage, orderBy } = filters

    const items = await prisma.nfeProduto.findMany({
      where: {
        descricao: { contains: name, mode: 'insensitive' },
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        descricao: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.nfeProduto.count({
      where: {
        descricao: { contains: name },
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
