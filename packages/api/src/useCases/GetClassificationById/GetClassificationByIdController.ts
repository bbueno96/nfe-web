import { Request, Response } from 'express'

import { GetClassificationByIdUseCase } from './GetClassificationByIdUseCase'

export class GetClassificationByIdController {
  constructor(private getClassificationByIdUseCase: GetClassificationByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const classification = await this.getClassificationByIdUseCase.execute(id)
    return response.json(classification)
  }
}
