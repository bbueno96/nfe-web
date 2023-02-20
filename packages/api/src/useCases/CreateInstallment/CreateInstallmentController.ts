import { Request, Response } from 'express'

import { CreateInstallmentUseCase } from './CreateInstallmentUseCase'

export class CreateInstallmentController {
  constructor(private CreateInstallmentUseCase: CreateInstallmentUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      numeroDoc,
      customerId,
      numberInstallment,
      dueDate,
      value,
      createdAt,
      classificationId,
      discount,
      addition,
      bankAccountId,
      bankSlip,
      customerApoioId,
      installments,
      subAccounts,
      customerApoioName,
      cpfCnpjApoio,
      phoneApoio,
      postalCodeApoio,
      addressApoio,
      stateApoio,
      cityApoio,
      stateInscriptionApoio,
      Customer,
    } = request.body
    const { companyId, id: employeeId } = request.user

    const accountPayable = await this.CreateInstallmentUseCase.execute({
      numeroDoc,
      customerId,
      numberInstallment,
      dueDate,
      value,
      createdAt,
      classificationId,
      discount,
      addition,
      bankAccountId,
      bankSlip,
      customerApoioId,
      installments,
      subAccounts,
      customerApoioName,
      cpfCnpjApoio,
      phoneApoio,
      postalCodeApoio,
      addressApoio,
      stateApoio,
      cityApoio,
      stateInscriptionApoio,
      employeeId,
      companyId,
      Customer,
    })
    return response.status(201).json({ accountPayable })
  }
}
