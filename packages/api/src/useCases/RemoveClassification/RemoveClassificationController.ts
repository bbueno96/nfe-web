import { Request, Response } from 'express'

import { RemoveClassificationUseCase } from './RemoveClassificationUseCase'

export class RemoveClassificationController {
  constructor(private removeClassificationUseCase: RemoveClassificationUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const classification = await this.removeClassificationUseCase.execute(id)
    return response.status(204).send(classification)
  }
}
