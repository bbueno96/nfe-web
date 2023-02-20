import { Request, Response } from 'express'

import { CreateBudgetUseCase } from './CreateBudgetUseCase'

export class CreateBudgetController {
  constructor(private CreateBudgetUseCase: CreateBudgetUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
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
    } = request.body

    const id = await this.CreateBudgetUseCase.execute({
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
      products: BudgetProducts,
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
    })
    return response.status(201).json({ id })
  }
}
