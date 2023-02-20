import { Request, Response } from 'express'

import { GetBudgetByIdUseCase } from './GetBudgetByIdUseCase'

export class GetBudgetByIdController {
  constructor(private getBudgetByIdUseCase: GetBudgetByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const budget = await this.getBudgetByIdUseCase.execute(id)
    return response.json(budget)
  }
}
