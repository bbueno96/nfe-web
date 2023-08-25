import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateOrderUseCase } from './CreateOrderUseCase'

export class CreateOrderController {
  constructor(private CreateOrderUseCase: CreateOrderUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId, id: employeeId } = request.user

    const {
      numberOrder,
      createdAt,
      status,
      discount,
      total,
      customerId,
      shipping,
      OrderProducts,
      Customer,
      obs,
      payMethodId,
      budgetId,
      customerApoioId,
      customerApoioName,
      installments,
      paymentMean,
      propertyId,
      customerApoioProperty,
    } = request.body

    return prisma.$transaction(async prismaTransaction => {
      const id = await this.CreateOrderUseCase.execute(
        {
          numberOrder,
          createdAt,
          status,
          discount,
          total,
          customerId,
          shipping,
          employeeId,
          companyId,
          products: OrderProducts,
          Customer,
          obs,
          payMethodId,
          budgetId,
          customerApoioId,
          customerApoioName,
          installments,
          paymentMean,
          propertyId,
          customerApoioProperty,
        },
        prismaTransaction,
      )

      return response.status(201).json({ id })
    })
  }
}
