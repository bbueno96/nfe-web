import { Request, Response } from 'express'

import { CreateTaxSituationUseCase } from './CreateTaxSituationUseCase'

export class CreateTaxSituationController {
  constructor(private CreateTaxSituationUseCase: CreateTaxSituationUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      description,
      aliquotaIcms,
      cst,
      simplesNacional,
      baseIcms,
      cfopState,
      cfopInter,
      cfopStatePf,
      cfopInterPf,
    } = request.body
    const { companyId } = request.user

    const id = await this.CreateTaxSituationUseCase.execute({
      description,
      aliquotaIcms,
      cst,
      companyId,
      simplesNacional,
      baseIcms,
      cfopState,
      cfopInter,
      cfopStatePf,
      cfopInterPf,
    })
    return response.status(201).json({ id })
  }
}
