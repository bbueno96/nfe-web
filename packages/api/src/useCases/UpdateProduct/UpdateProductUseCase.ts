import { Prisma } from '@prisma/client'

import { Product } from '../../entities/Product'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateProductDTO } from './UpdateProductDTO'

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  sanitizeData(data: IUpdateProductDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateProductDTO) {
    if (!data.description) {
      throw new ApiError('a Descrição é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateProductDTO) {
    const prod = await this.productRepository.findById(data.id)
    if (!prod) {
      throw new ApiError('Produto não encontrado.', 404)
    }
    this.sanitizeData(data)
    await this.validate(data)

    const product = await this.productRepository.update({
      ...data,
      createAt: new Date(),
      stock: new Prisma.Decimal(data.stock),
      stockMinium: new Prisma.Decimal(data.stockMinium),
      value: new Prisma.Decimal(data.value),
      valueOld: new Prisma.Decimal(data.valueOld),
      purchaseValue: new Prisma.Decimal(data.purchaseValue),
      ipi: new Prisma.Decimal(data.ipi),
      weight: new Prisma.Decimal(data.weight),
      height: new Prisma.Decimal(data.height),
      width: new Prisma.Decimal(data.width),
      length: new Prisma.Decimal(data.length),
      size: new Prisma.Decimal(data.size),
      alqPis: new Prisma.Decimal(data.alqPis),
      alqCofins: new Prisma.Decimal(data.alqCofins),
    })

    return product.id
  }
}
