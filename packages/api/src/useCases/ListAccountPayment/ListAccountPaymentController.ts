import { Request, Response } from 'express'

import { ListAccountPaymentUseCase } from './ListAccountPaymentUseCase'

export class ListAccountPaymentController {
  constructor(private listAccountPaymentUseCase: ListAccountPaymentUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { bankAccountId, maxDueDate, minDueDate, paymentMeanId, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const payment = await this.listAccountPaymentUseCase.execute({
      bankAccountId,
      maxDueDate,
      minDueDate,
      paymentMeanId,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(payment)
  }
}
