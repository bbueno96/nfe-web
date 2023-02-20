import { Request, Response } from 'express'

import { GetNfeByIdUseCase } from './GetNfeByIdUseCase'

export class GetNfeByIdController {
  constructor(private getNfeByIdUseCase: GetNfeByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const Nfe = await this.getNfeByIdUseCase.execute(id)
    return response.json(Nfe)
  }
}
