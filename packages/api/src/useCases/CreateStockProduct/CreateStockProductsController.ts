import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateStockProductsUseCase } from './CreateStockProductsUseCase'

export class CreateStockProductsController {
  constructor(private createStockProductsUseCase: CreateStockProductsUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { createdAt, typeGenerate, amount, productId, numeroDoc, type } = request.body
    const { companyId, id: employeeId } = request.user

    return prisma.$transaction(async prismaTransaction => {
      const id = await this.createStockProductsUseCase.execute(
        {
          createdAt,
          typeGenerate,
          amount,
          productId,
          numeroDoc,
          type,
          companyId,
          employeeId,
        },
        prismaTransaction,
      )
      return response.status(201).json({ id })
    })
  }
}
