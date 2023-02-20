import { Request, Response } from 'express'

import { UpdateAccountPayableUseCase } from './UpdateAccountPayableUseCase'

export class UpdateAccountPayableController {
  constructor(private updateAccountPayableUseCase: UpdateAccountPayableUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      id,
      createdAt,
      description,
      dueDate,
      value,
      discount,
      addition,
      numberInstallment,
      installments,
      providerId,
      document,
      classificationId,
      disabledAt,
      accountPaymentId,
      providerName,
    } = request.body

    await this.updateAccountPayableUseCase.execute({
      id,
      createdAt,
      description,
      dueDate,
      value,
      discount,
      addition,
      numberInstallment,
      installments,
      providerId,
      document,
      classificationId,
      disabledAt,
      accountPaymentId,
      providerName,
      companyId,
    })

    return response.status(204).send()
  }
}
