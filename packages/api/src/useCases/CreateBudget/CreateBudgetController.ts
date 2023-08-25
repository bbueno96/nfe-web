import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateBudgetUseCase } from './CreateBudgetUseCase'

export class CreateBudgetController {
  constructor(private createBudgetUseCase: CreateBudgetUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId, id: employeeId } = request.user

    const {
      numberBudget,
      createdAt,
      status,
      discount,
      total,
      deliveryForecast,
      customerId,
      shipping,
      auth,
      BudgetProducts,
      Customer,
      obs,
      payMethodId,
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
      installments,
      paymentMean,
      propertyId,
      customerIdApoio,
      customerApoioProperty,
    } = request.body

    return prisma.$transaction(async prismaTransaction => {
      const id = await this.createBudgetUseCase.execute(
        {
          numberBudget,
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
          products: BudgetProducts.filter(prod => prod.amount > 0),
          Customer,
          obs,
          payMethodId,
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
          installments,
          paymentMean,
          propertyId,
          customerIdApoio,
          customerApoioProperty,
        },
        prismaTransaction,
      )

      return response.status(201).json({ id })
    })
  }
}
