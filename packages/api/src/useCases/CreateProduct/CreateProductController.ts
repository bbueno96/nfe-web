import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateProductUseCase } from './CreateProductUseCase'

export class CreateProductController {
  constructor(private CreateProductUseCase: CreateProductUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      group,
      brand,
      description,
      stock,
      stockMinium,
      value,
      valueOld,
      purchaseValue,
      lastPurchase,
      lastSale,
      createAt,
      und,
      barCode,
      ncm,
      weight,
      height,
      width,
      length,
      color,
      size,
      cf,
      cod,
      productstax,
    } = request.body
    return prisma.$transaction(async prismaTransaction => {
      const id = await this.CreateProductUseCase.execute(
        {
          group,
          brand,
          description,
          stock,
          stockMinium,
          value,
          valueOld,
          purchaseValue,
          lastPurchase,
          lastSale,
          createAt,
          und,
          barCode,
          ncm,
          weight,
          height,
          width,
          length,
          color,
          size,
          companyId,
          cf,
          cod,
        },
        prismaTransaction,
        productstax,
      )
      return response.status(201).json({ id })
    })
  }
}
