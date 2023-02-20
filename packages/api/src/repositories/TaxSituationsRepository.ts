import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { TaxSituation } from '../entities/TaxSituation'
import { IListTaxSituationFilters } from '../useCases/ListTaxSituation/ListTaxSituationDTO'

export class TaxSituationsRepository {
  async update(data: TaxSituation): Promise<TaxSituation> {
    return await prisma.taxSituation.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: TaxSituation): Promise<TaxSituation> {
    return await prisma.taxSituation.create({ data })
  }

  async findById(id: string): Promise<TaxSituation> {
    return await prisma.taxSituation.findUnique({
      where: { id },
    })
  }

  async findByProvider(aliquotaIcms: number, cst: number, company: string): Promise<TaxSituation> {
    return await prisma.taxSituation.findFirst({
      where: { aliquotaIcms, cst, companyId: company },
    })
  }

  async remove(taxSituation: TaxSituation): Promise<void> {
    await prisma.taxSituation.update({
      where: { id: taxSituation.id },
      data: taxSituation,
    })
  }

  async list(filters: IListTaxSituationFilters): Promise<TaxSituation[]> {
    const { companyId } = filters
    const items = await prisma.taxSituation.findMany({
      where: {
        companyId,
      },
    })
    return items
  }

  async listPost(filters: IListTaxSituationFilters): Promise<List<TaxSituation>> {
    const { companyId, description, page, perPage, orderBy } = filters
    console.log(companyId)
    const items = await prisma.taxSituation.findMany({
      where: {
        description: { contains: description, mode: 'insensitive' },
        companyId,
      },
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        description: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.taxSituation.count({
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

  async findIbptByNcm(NCM: string): Promise<any> {
    return await prisma.ibpt.findFirst({
      where: { NCM_NBS: NCM },
    })
  }

  async findCestByNcm(NCM: string): Promise<any> {
    return await prisma.cest.findFirst({
      where: { NCM },
    })
  }
}
