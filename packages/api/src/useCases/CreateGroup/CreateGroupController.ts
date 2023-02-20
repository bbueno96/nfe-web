import { Request, Response } from 'express'

import { CreateGroupUseCase } from './CreateGroupUseCase'

export class CreateGroupController {
  constructor(private CreateGroupUseCase: CreateGroupUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description } = request.body
    const { companyId } = request.user

    const id = await this.CreateGroupUseCase.execute({
      description,
      companyId,
    })
    return response.status(201).json({ id })
  }
}
