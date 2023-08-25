import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateAccountPaymentUseCase } from './CreateAccountPaymentUseCase'

export class CreateAccountPaymentController {
  constructor(private CreateAccountPaymentUseCase: CreateAccountPaymentUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { createdAt, value, paymentMeanId, bankAccountId, accountsSelected } = request.body
    const { companyId } = request.user

    return prisma.$transaction(async prismaTransaction => {
      const id = await this.CreateAccountPaymentUseCase.execute(
        {
          createdAt,
          value,
          paymentMeanId,
          bankAccountId,
          accountsSelected,
          companyId,
        },
        prismaTransaction,
      )
      return response.status(201).json({ id })
    })
  }
}
