import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { Nfe } from '../entities/Nfe'
import { NfeStorege } from '../entities/NfeStorege'
import { IListNfeFilters } from '../useCases/ListNfe/ListNfeDTO'

export class NfeRepository {
  update(id: string, data: Partial<Nfe>, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.nfe.update({
      where: { id },
      data,
    })
  }

  create(data: Nfe, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.nfe.create({ data })
  }

  createNfeStorage(data: NfeStorege) {
    return prisma.nfeStorege.create({ data })
  }

  findById(id: string) {
    return prisma.nfe.findUnique({
      where: { id },
    })
  }

  findByIdProducts(id: string) {
    return prisma.nfe.findUnique({
      where: { id },
      include: {
        NfeProduto: true,
      },
    })
  }

  findByIdP(id: string) {
    return prisma.nfe.findUnique({
      where: { id },
    })
  }

  async remove(nfe: Nfe): Promise<void> {
    await prisma.nfe.update({
      where: { id: nfe.id },
      data: nfe,
    })
  }

  getXmlNota(chave: string) {
    return prisma.nfeStorege.findFirst({
      where: { nome: chave },
    })
  }

  findNumeroNota(numeroNota: number, cpfCnpj: string) {
    return prisma.nfe.findFirst({
      where: {
        numeroNota,
        cpfCnpj,
      },
    })
  }

  async list(filters: IListNfeFilters): Promise<List<Nfe>> {
    const { companyId, minDate, maxDate, status, name, customerApoioProperty, page, perPage, tipo } = filters
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
    if (customerApoioProperty) {
      where = {
        ...where,
        customerApoioProperty: { contains: customerApoioProperty, mode: 'insensitive' },
      }
    }
    if (minDate && maxDate) {
      where = {
        ...where,
        data: {
          gte: minDate,
          lte: maxDate,
        },
      }
    }
    if (status) {
      where = {
        ...where,
        status: { contains: status, mode: 'insensitive' },
      }
    }
    let orderBy = {}
    if (tipo) {
      if (tipo === 'ENTRADA') {
        orderBy = {
          data: 'desc',
        }
        where = {
          ...where,
          tipo: { contains: tipo, mode: 'insensitive' },
          status: { equals: '' },
        }
      } else {
        orderBy = {
          numeroNota: 'desc',
        }
        where = {
          ...where,
          status: { not: '' },
        }
      }
    }

    const items = await prisma.nfe.findMany({
      where,
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy,
    })

    const records = await prisma.nfe.count({
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
