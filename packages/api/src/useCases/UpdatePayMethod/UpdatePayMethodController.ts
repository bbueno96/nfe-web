import { Request, Response } from 'express'

import { UpdatePayMethodUseCase } from './UpdatePayMethodUseCase'

export class UpdatePayMethodController {
  constructor(private updatePayMethodUseCase: UpdatePayMethodUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      id,
      description,
      fine,
      interest,
      dueDay,
      numberInstallments,
      bankAccountId,
      bankSlip,
      wallet,
      ourNumber,
      generateInstallmens,
    } = request.body

    await this.updatePayMethodUseCase.execute({
      id,
      description,
      fine,
      interest,
      dueDay,
      numberInstallments,
      bankAccountId,
      bankSlip,
      wallet,
      ourNumber,
      companyId,
      generateInstallmens,
    })

    return response.status(204).send()
  }
}
