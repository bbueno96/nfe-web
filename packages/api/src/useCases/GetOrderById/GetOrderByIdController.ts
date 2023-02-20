import { Request, Response } from 'express'

import { GetOrderByIdUseCase } from './GetOrderByIdUseCase'

export class GetOrderByIdController {
  constructor(private getOrderByIdUseCase: GetOrderByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const order = await this.getOrderByIdUseCase.execute(id)

    return response.json(order)
  }
}
