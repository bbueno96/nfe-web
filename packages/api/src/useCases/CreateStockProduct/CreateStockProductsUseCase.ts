import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { ProductRepository } from '../../repositories/ProductRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateStockProductsDTO } from './CreateStockProductsDTO'

export class CreateStockProductsUseCase {
  constructor(private stockProductsRepository: StockProductsRepository, private productRepository: ProductRepository) {}

  validate(data: ICreateStockProductsDTO) {
    if (!data.type) {
      throw new ApiError('O tipo é obrigatório.', 422)
    }
    if (!data.amount) {
      throw new ApiError('A Quantidade é obrigatória.', 422)
    }
    if (!data.productId) {
      throw new ApiError('O produto é obrigatório.', 422)
    }
  }

  async execute(data: ICreateStockProductsDTO, prismaTransaction: PrismaTransaction) {
    await this.validate(data)
    const prod = await this.productRepository.findById(data.productId)
    if (prod) {
      let value = 0
      if (data.type === 'S') value = parseFloat('' + prod.stock) - data.amount
      else value = parseFloat('' + prod.stock) + data.amount
      await this.productRepository.update(
        prod.id,
        {
          stock: new Prisma.Decimal(value),
        },
        prismaTransaction,
      )
      const result = await this.stockProductsRepository.create(
        {
          productId: data.productId,
          amount: new Prisma.Decimal(data.amount || 1),
          type: data.type,
          numeroDoc: data.numeroDoc || '',
          typeGenerate: data.typeGenerate,
          companyId: data.companyId,
          createdAt: data.createdAt,
          generateId: null,
          number: 0,
          employeeId: data.employeeId || '',
        },
        prismaTransaction,
      )
      return result.id
    }
  }
}
