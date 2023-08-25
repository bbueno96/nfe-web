import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { TaxSituation } from '../entities/TaxSituation'
import { IListTaxSituationFilters } from '../useCases/ListTaxSituation/ListTaxSituationDTO'

export class TaxSituationsRepository {
  update(data: TaxSituation) {
    return prisma.taxSituation.update({
      where: { id: data.id },
      data,
    })
  }

  create(data: TaxSituation) {
    return prisma.taxSituation.create({ data })
  }

  findById(id: string) {
    return prisma.taxSituation.findUnique({
      where: { id },
    })
  }

  findByProvider(aliquotaIcms: number, cst: number, company: string) {
    return prisma.taxSituation.findFirst({
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
    const items = await prisma.taxSituation.findMany({
      where: {
        description: { contains: description, mode: 'insensitive' },
        companyId,
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
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
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }

  findIbptByNcm(NCM: string) {
    return prisma.ibpt.findFirst({
      where: { NCM_NBS: NCM },
    })
  }

  findCestByNcm(NCM: string) {
    return prisma.cest.findFirst({
      where: { NCM },
    })
  }
}
