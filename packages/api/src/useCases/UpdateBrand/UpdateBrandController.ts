import { Request, Response } from 'express'

import { UpdateBrandUseCase } from './UpdateBrandUseCase'

export class UpdateBrandController {
  constructor(private updateBrandUseCase: UpdateBrandUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id, description } = request.body

    await this.updateBrandUseCase.execute({
      id,
      description,
      companyId,
    })

    return response.status(204).send()
  }
}
