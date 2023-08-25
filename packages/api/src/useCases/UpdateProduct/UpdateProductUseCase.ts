import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { ProductTax } from '../../entities/ProductTax'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateProductDTO } from './UpdateProductDTO'

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository, private productTaxRepository: ProductTaxRepository) {}

  sanitizeData(data: IUpdateProductDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateProductDTO) {
    if (!data.description) {
      throw new ApiError('a Descrição é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateProductDTO, prismaTransaction: PrismaTransaction, productstax?: ProductTax[]) {
    if (data.id) {
      const prod = await this.productRepository.findById(data.id)
      if (!prod) {
        throw new ApiError('Produto não encontrado.', 404)
      }
      this.sanitizeData(data)
      await this.validate(data)
      const product = await this.productRepository.update(
        prod.id,
        {
          stock: new Prisma.Decimal(data.stock),
          stockMinium: new Prisma.Decimal(data.stockMinium || 0),
          value: new Prisma.Decimal(data.value),
          valueOld: new Prisma.Decimal(data.valueOld),
          purchaseValue: new Prisma.Decimal(data.purchaseValue),
          weight: new Prisma.Decimal(data.weight),
          height: new Prisma.Decimal(data.height),
          width: new Prisma.Decimal(data.width),
          length: new Prisma.Decimal(data.length),
          size: new Prisma.Decimal(data.size),
          ncm: data.ncm,
          group: data.group || null,
          brand: data.brand || null,
          description: data.description,
          cod: data.cod,
          lastPurchase: data.lastPurchase,
          lastSale: data.lastSale,
          und: data.und,
          barCode: data.barCode,
          color: data.color,
          cf: data.cf,
        },
        prismaTransaction,
      )
      if (productstax) {
        const listUf = productstax.map(i => i.uf)
        const repeat = listUf.some(x => listUf.indexOf(x) !== listUf.lastIndexOf(x))
        if (repeat) throw new ApiError('Existe Uf repetida. Verifique!', 422)
        await this.productTaxRepository.removeByProduct(product?.id, prismaTransaction)
        await Promise.all(
          productstax.map(async producttax => {
            if (producttax.uf) {
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
                  product: product?.id,
                  aliquotaIcmsSt: new Prisma.Decimal(producttax.aliquotaIcmsSt || 0),
                  baseIcmsSt: new Prisma.Decimal(producttax.baseIcmsSt || 0),
                  alqPis: new Prisma.Decimal(producttax.alqPis || 0),
                  alqCofins: new Prisma.Decimal(producttax.alqCofins || 0),
                  ipi: new Prisma.Decimal(producttax.ipi || 0),
                  mva: new Prisma.Decimal(producttax.mva || 0),
                },
                prismaTransaction,
              )
            }
          }),
        )
      }
      return product.id
    }
  }
}
