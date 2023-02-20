import { Request, Response } from 'express'

import { GetProductByIdUseCase } from './GetProductByIdUseCase'

export class GetProductByIdController {
  constructor(private getProductByIdUseCase: GetProductByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const brand = await this.getProductByIdUseCase.execute(id)
    return response.json(brand)
  }
}
