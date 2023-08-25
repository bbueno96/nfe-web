import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { UpdateBudgetUseCase } from './UpdateBudgetUseCase'

export class UpdateBudgetController {
  constructor(private updateBudgetUseCase: UpdateBudgetUseCase) {
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
      deliveryForecast,
      customerId,
      shipping,
      employeeId,
      auth,
      payMethodId,
      obs,
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
      BudgetProducts,
      installments,
      paymentMean,
      propertyId,
      customerIdApoio,
      customerApoioProperty,
    } = request.body
    return prisma.$transaction(async prismaTransaction => {
      await this.updateBudgetUseCase.execute(
        {
          id,
          createdAt,
          status,
          discount,
          total,
          deliveryForecast,
          customerId,
          shipping,
          employeeId,
          auth,
          companyId,
          payMethodId,
          obs,
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
          BudgetProducts: BudgetProducts.filter(prod => prod.amount > 0),
          installments,
          paymentMean,
          propertyId,
          customerIdApoio,
          customerApoioProperty,
        },
        prismaTransaction,
      )

      return response.status(204).send()
    })
  }
}
