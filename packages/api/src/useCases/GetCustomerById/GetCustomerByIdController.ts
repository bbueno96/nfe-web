import { Request, Response } from 'express'

import { GetCustomerByIdUseCase } from './GetCustomerByIdUseCase'

export class GetCustomerByIdController {
  constructor(private getCustomerByIdUseCase: GetCustomerByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const customer = await this.getCustomerByIdUseCase.execute(id)
    return response.json(customer)
  }
}
