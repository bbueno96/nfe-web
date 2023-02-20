import { Request, Response } from 'express'

import { CreateAccountPayableUseCase } from './CreateAccountPayableUseCase'

export class CreateAccountPayableController {
  constructor(private CreateAccountPayableUseCase: CreateAccountPayableUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
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
      providerName,
      subAccounts,
    } = request.body
    const { companyId } = request.user

    const accountPayable = await this.CreateAccountPayableUseCase.execute({
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
      subAccounts,
      providerName,
      companyId,
    })
    return response.status(201).json({ accountPayable })
  }
}
