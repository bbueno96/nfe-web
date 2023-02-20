import { Request, Response } from 'express'

import { RemoveCustomerUseCase } from './RemoveCustomerUseCase'

export class RemoveCustomerController {
  constructor(private removeCustomerUseCase: RemoveCustomerUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const customer = await this.removeCustomerUseCase.execute(id)
    return response.status(204).send(customer)
  }
}
