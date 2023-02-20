import { Request, Response } from 'express'

import { GetTaxSituationByIdUseCase } from './GetTaxSituationByIdUseCase'

export class GetTaxSituationByIdController {
  constructor(private getTaxSituationByIdUseCase: GetTaxSituationByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const taxSituation = await this.getTaxSituationByIdUseCase.execute(id)
    return response.json(taxSituation)
  }
}
