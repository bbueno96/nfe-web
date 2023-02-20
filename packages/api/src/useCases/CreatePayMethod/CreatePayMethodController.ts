import { Request, Response } from 'express'

import { CreatePayMethodUseCase } from './CreatePayMethodUseCase'

export class CreatePayMethodController {
  constructor(private CreatePayMethodUseCase: CreatePayMethodUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      description,
      fine,
      interest,
      dueDay,
      numberInstallments,
      bankAccountId,
      bankSlip,
      wallet,
      generateInstallmens,
    } = request.body
    const { companyId } = request.user

    const id = await this.CreatePayMethodUseCase.execute({
      description,
      fine,
      interest,
      dueDay,
      numberInstallments,
      bankAccountId,
      bankSlip,
      wallet,
      companyId,
      generateInstallmens,
    })
    return response.status(201).json({ id })
  }
}
