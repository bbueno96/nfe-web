import { Request, Response } from 'express'

import { GetBrandByIdUseCase } from './GetBrandByIdUseCase'

export class GetBrandByIdController {
  constructor(private getBrandByIdUseCase: GetBrandByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const brand = await this.getBrandByIdUseCase.execute(id)
    return response.json(brand)
  }
}
