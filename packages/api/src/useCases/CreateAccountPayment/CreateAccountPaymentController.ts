import { Request, Response } from 'express'

import { CreateAccountPaymentUseCase } from './CreateAccountPaymentUseCase'

export class CreateAccountPaymentController {
  constructor(private CreateAccountPaymentUseCase: CreateAccountPaymentUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { createdAt, value, paymentMeanId, bankAccountId, accountsSelected } = request.body
    const { companyId } = request.user

    const id = await this.CreateAccountPaymentUseCase.execute({
      createdAt,
      value,
      paymentMeanId,
      bankAccountId,
      accountsSelected,
      companyId,
    })
    return response.status(201).json({ id })
  }
}
