import { Request, Response } from 'express'

import { RemoveOrderUseCase } from './RemoveOrderUseCase'

export class RemoveOrderController {
  constructor(private removeOrderUseCase: RemoveOrderUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const order = await this.removeOrderUseCase.execute(id)
    return response.status(204).send(order)
  }
}
