import { Request, Response } from 'express'

import { CreateProductUseCase } from './CreateProductUseCase'

export class CreateProductController {
  constructor(private CreateProductUseCase: CreateProductUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
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
      st,
      und,
      barCode,
      ipi,
      ncm,
      cfop,
      pisCofins,
      weight,
      height,
      width,
      length,
      color,
      size,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cf,
      cod,
    } = request.body

    const id = await this.CreateProductUseCase.execute({
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
      st,
      und,
      barCode,
      ipi,
      ncm,
      cfop,
      pisCofins,
      weight,
      height,
      width,
      length,
      color,
      size,
      companyId,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cf,
      cod,
    })
    return response.status(201).json({ id })
  }
}
