import { Request, Response } from 'express'

import { GetGroupByIdUseCase } from './GetGroupByIdUseCase'

export class GetGroupByIdController {
  constructor(private getGroupByIdUseCase: GetGroupByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const brand = await this.getGroupByIdUseCase.execute(id)
    return response.json(brand)
  }
}
