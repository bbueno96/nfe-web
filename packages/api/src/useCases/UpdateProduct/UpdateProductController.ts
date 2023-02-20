import { Request, Response } from 'express'

import { UpdateProductUseCase } from './UpdateProductUseCase'

export class UpdateProductController {
  constructor(private UpdateProductUseCase: UpdateProductUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      id,
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

    const product = await this.UpdateProductUseCase.execute({
      id,
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
    return response.status(201).json({ product })
  }
}
