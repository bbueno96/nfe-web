import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { UpdateOrderUseCase } from './UpdateOrderUseCase'

export class UpdateOrderController {
  constructor(private updateOrderUseCase: UpdateOrderUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
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
      propertyId,
      customerApoioProperty,
    } = request.body
    return prisma.$transaction(async prismaTransaction => {
      await this.updateOrderUseCase.execute(
        {
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
          propertyId,
          customerApoioProperty,
        },
        prismaTransaction,
      )

      return response.status(204).send()
    })
  }
}
