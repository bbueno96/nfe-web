import { Prisma } from '@prisma/client'

import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { IUpdateProductTaxDTO } from './UpdateProductTaxDTO'

export class UpdateProductTaxUseCase {
  constructor(private productTaxRepository: ProductTaxRepository) {}

  async execute(producttax: IUpdateProductTaxDTO) {
    let oldData
    if (producttax.uf !== '') oldData = await this.productTaxRepository.findByUf(producttax.product, producttax.uf)
    if (oldData) {
      await this.productTaxRepository.update(
        oldData.id,
        {
          cfop: producttax.cfop,
          uf: producttax.uf,
          cst: producttax.cst || 0,
          aliquotaIcms: new Prisma.Decimal(producttax.aliquotaIcms || 0),
          cstCofins: producttax.cstCofins?.toString() || '',
          cstPis: producttax.cstPis?.toString() || '',
          baseIcms: new Prisma.Decimal(producttax.baseIcms || 0),
          simplesNacional: producttax.simplesNacional || false,
          product: producttax?.product,
          aliquotaIcmsSt: new Prisma.Decimal(producttax.aliquotaIcmsSt || 0),
          baseIcmsSt: new Prisma.Decimal(producttax.baseIcmsSt || 0),
          alqPis: new Prisma.Decimal(producttax.alqPis || 0),
          alqCofins: new Prisma.Decimal(producttax.alqCofins || 0),
          ipi: new Prisma.Decimal(producttax.ipi || 0),
          mva: new Prisma.Decimal(producttax.mva || 0),
        },
        null,
      )
    } else {
      await this.productTaxRepository.create(
        {
          cfop: producttax.cfop,
          uf: producttax.uf,
          cst: producttax.cst || 0,
          aliquotaIcms: new Prisma.Decimal(producttax.aliquotaIcms || 0),
          cstCofins: producttax.cstCofins?.toString() || '',
          cstPis: producttax.cstPis?.toString() || '',
          baseIcms: new Prisma.Decimal(producttax.baseIcms || 0),
          simplesNacional: producttax.simplesNacional || false,
          product: producttax?.product,
          aliquotaIcmsSt: new Prisma.Decimal(producttax.aliquotaIcmsSt || 0),
          baseIcmsSt: new Prisma.Decimal(producttax.baseIcmsSt || 0),
          alqPis: new Prisma.Decimal(producttax.alqPis || 0),
          alqCofins: new Prisma.Decimal(producttax.alqCofins || 0),
          ipi: new Prisma.Decimal(producttax.ipi || 0),
          mva: new Prisma.Decimal(producttax.mva || 0),
        },
        null,
      )
    }
  }
}
