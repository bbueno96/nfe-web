import { Request, Response } from 'express'

import { CreateBrandUseCase } from './CreateBrandUseCase'

export class CreateBrandController {
  constructor(private CreateBrandUseCase: CreateBrandUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { description } = request.body

    const id = await this.CreateBrandUseCase.execute({
      description,
      companyId,
    })
    return response.status(201).json({ id })
  }
}
