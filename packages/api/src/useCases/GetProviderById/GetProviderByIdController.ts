import { Request, Response } from 'express'

import { GetProviderByIdUseCase } from './GetProviderByIdUseCase'

export class GetProviderByIdController {
  constructor(private getProviderByIdUseCase: GetProviderByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const provider = await this.getProviderByIdUseCase.execute(id)
    return response.json(provider)
  }
}
