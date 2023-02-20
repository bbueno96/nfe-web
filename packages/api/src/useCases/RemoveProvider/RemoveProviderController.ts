import { Request, Response } from 'express'

import { RemoveProviderUseCase } from './RemoveProviderUseCase'

export class RemoveProviderController {
  constructor(private removeProviderUseCase: RemoveProviderUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const provider = await this.removeProviderUseCase.execute(id)
    return response.status(204).send(provider)
  }
}
