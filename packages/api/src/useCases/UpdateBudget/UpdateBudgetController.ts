import { Request, Response } from 'express'

import { UpdateBudgetUseCase } from './UpdateBudgetUseCase'

export class UpdateBudgetController {
  constructor(private updateBudgetUseCase: UpdateBudgetUseCase) {
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
    } = request.body

    await this.updateBudgetUseCase.execute({
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
      BudgetProducts,
    })

    return response.status(204).send()
  }
}
