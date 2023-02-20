import { Request, Response } from 'express'

import { UpdateGroupUseCase } from './UpdateGroupUseCase'

export class UpdateGroupController {
  constructor(private updateGroupUseCase: UpdateGroupUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id, description } = request.body

    await this.updateGroupUseCase.execute({
      id,
      description,
      companyId,
    })

    return response.status(204).send()
  }
}
