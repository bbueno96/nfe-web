import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateInstallmentUseCase } from './CreateInstallmentUseCase'

export class CreateInstallmentController {
  constructor(private CreateInstallmentUseCase: CreateInstallmentUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
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
    return prisma.$transaction(async prismaTransaction => {
      const accountPayable = await this.CreateInstallmentUseCase.execute(
        {
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
        },
        prismaTransaction,
      )
      return response.status(201).json({ accountPayable })
    })
  }
}
