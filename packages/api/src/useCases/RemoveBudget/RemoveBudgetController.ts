import { Request, Response } from 'express'

import { RemoveBudgetUseCase } from './RemoveBudgetUseCase'

export class RemoveBudgetController {
  constructor(private removeBudgetUseCase: RemoveBudgetUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const budget = await this.removeBudgetUseCase.execute(id)
    return response.status(204).send(budget)
  }
}
