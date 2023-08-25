import { Request, Response } from 'express'

import { UpdateProductTaxUseCase } from './UpdateProductTaxUseCase'

export class UpdateProductTaxController {
  constructor(private updateProductTaxUseCase: UpdateProductTaxUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      id,
      product,
      uf,
      aliquotaIcms,
      cst,
      baseIcms,
      aliquotaIcmsSt,
      baseIcmsSt,
      mva,
      cfop,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      ipi,
    } = request.body

    await this.updateProductTaxUseCase.execute({
      id,
      product,
      uf,
      aliquotaIcms,
      cst,
      baseIcms,
      simplesNacional: false,
      aliquotaIcmsSt,
      baseIcmsSt,
      mva,
      cfop,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      ipi,
    })

    return response.status(204).send()
  }
}
