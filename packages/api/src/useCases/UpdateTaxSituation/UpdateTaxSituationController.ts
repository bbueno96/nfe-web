import { Request, Response } from 'express'

import { UpdateTaxSituationUseCase } from './UpdateTaxSituationUseCase'

export class UpdateTaxSituationController {
  constructor(private updateTaxSituationUseCase: UpdateTaxSituationUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      id,
      description,
      aliquotaIcms,
      cst,
      baseIcms,
      simplesNacional,
      cfopState,
      cfopInter,
      cfopStatePf,
      cfopInterPf,
    } = request.body

    await this.updateTaxSituationUseCase.execute({
      id,
      description,
      aliquotaIcms,
      cst,
      companyId,
      baseIcms,
      simplesNacional,
      cfopState,
      cfopInter,
      cfopStatePf,
      cfopInterPf,
    })

    return response.status(204).send()
  }
}
