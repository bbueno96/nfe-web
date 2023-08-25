import { Request, Response } from 'express'

import { ListInstallmentUseCase } from './ListInstallmentsUseCase'

export class ListInstallmentController {
  constructor(private listInstallmentUseCase: ListInstallmentUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      customer,
      page = 1,
      perPage = 10,
      orderBy,
      paymentMethodId,
      minDueDate,
      maxDueDate,
      minCreatedAtDate,
      maxCreatedAtDate,
      isPaid,
      numeroDoc,
      bankAccountId,
      customerApoioName,
      wallet,
      bankRemittance,
    } = request.body
    const { companyId } = request.user
    const installment = await this.listInstallmentUseCase.execute({
      customer: customer as string,
      companyId,
      minDueDate,
      maxDueDate,
      minCreatedAtDate,
      maxCreatedAtDate,
      isPaid,
      numeroDoc,
      paymentMethodId,
      bankAccountId,
      customerApoioName,
      wallet,
      bankRemittance,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(installment)
  }
}
