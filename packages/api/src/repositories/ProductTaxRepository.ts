import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { ProductTax } from '../entities/ProductTax'
import { IListProductTaxFilters } from '../useCases/ListProductTaxPost/ListProductTaxPostDTO'

export class ProductTaxRepository {
  update(id: string, data: Partial<ProductTax>, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.productTax.update({
      where: { id },
      data,
    })
  }

  create(data: ProductTax, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.productTax.create({ data })
  }

  findById(id: string) {
    return prisma.productTax.findFirst({
      where: { id },
    })
  }

  findByUf(product: string, uf: string) {
    return prisma.productTax.findFirst({
      where: {
        product,
        uf,
      },
    })
  }

  findByFirst(product: string) {
    return prisma.productTax.findFirst({
      where: {
        product,
      },
    })
  }

  findByProvider(aliquotaIcms: number) {
    return prisma.productTax.findFirst({
      where: { aliquotaIcms },
    })
  }

  async remove(productTax: ProductTax, prismaTransaction: PrismaTransaction): Promise<void> {
    await prismaTransaction.productTax.update({
      where: { id: productTax.id },
      data: productTax,
    })
  }

  async removeByProduct(product: string, prismaTransaction: PrismaTransaction): Promise<void> {
    await prismaTransaction.$queryRaw`DELETE FROM product_tax WHERE "product" = ${product}`
  }

  async listPost(filters: IListProductTaxFilters): Promise<List<ProductTax>> {
    const { product, uf, page, perPage, orderBy } = filters
    const items = await prisma.productTax.findMany({
      where: {
        product,
        uf,
      },
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        uf: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.productTax.count({
      where: {
        product,
        uf,
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
