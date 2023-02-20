import { Request, Response } from 'express'

import { CreateOrderUseCase } from './CreateOrderUseCase'

export class CreateOrderController {
  constructor(private CreateOrderUseCase: CreateOrderUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
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
    } = request.body

    const id = await this.CreateOrderUseCase.execute({
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
    })
    return response.status(201).json({ id })
  }
}
