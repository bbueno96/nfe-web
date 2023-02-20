import { Request, Response } from 'express'

import { UpdateClassificationUseCase } from './UpdateClassificationUseCase'

export class UpdateClassificationController {
  constructor(private updateClassificationUseCase: UpdateClassificationUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id, description, code, isGroup, parentId } = request.body

    await this.updateClassificationUseCase.execute({
      id,
      description,
      code,
      isGroup,
      parentId,
      companyId,
    })

    return response.status(204).send()
  }
}
