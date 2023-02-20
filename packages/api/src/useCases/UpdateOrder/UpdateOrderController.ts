import { Request, Response } from 'express'

import { UpdateOrderUseCase } from './UpdateOrderUseCase'

export class UpdateOrderController {
  constructor(private updateOrderUseCase: UpdateOrderUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      id,
      createdAt,
      status,
      discount,
      total,
      customerId,
      shipping,
      employeeId,
      payMethodId,
      obs,
      OrderProducts,
      customerApoioId,
      customerApoioName,
      stateInscriptionApoio,
      emailApoio,
      phoneApoio,
      addressApoio,
      addressNumberApoio,
      complementApoio,
      provinceApoio,
      postalCodeApoio,
      cityIdApoio,
      stateApoio,
      cityApoio,
      cpfCnpjApoio,
    } = request.body

    await this.updateOrderUseCase.execute({
      id,
      createdAt,
      status,
      discount,
      total,
      customerId,
      shipping,
      employeeId,
      companyId,
      payMethodId,
      obs,
      products: OrderProducts,
      customerApoioId,
      customerApoioName,
      stateInscriptionApoio,
      emailApoio,
      phoneApoio,
      addressApoio,
      addressNumberApoio,
      complementApoio,
      provinceApoio,
      postalCodeApoio,
      cityIdApoio,
      stateApoio,
      cityApoio,
      cpfCnpjApoio,
    })

    return response.status(204).send()
  }
}
