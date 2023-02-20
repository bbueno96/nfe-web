import { Request, Response } from 'express'

import { CreateClassificationUseCase } from './CreateClassificationUseCase'

export class CreateClassificationController {
  constructor(private CreateClassificationUseCase: CreateClassificationUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, code, isGroup, parentId } = request.body
    const { companyId } = request.user

    const id = await this.CreateClassificationUseCase.execute({
      description,
      code,
      isGroup,
      parentId,
      companyId,
    })
    return response.status(201).json({ id })
  }
}
