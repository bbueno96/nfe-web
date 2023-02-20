import { Request, Response } from 'express'

import { CheckNfeUseCase } from './CheckNfeUseCase'

export class CheckNfeController {
  constructor(private CheckNfeUseCase: CheckNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params

    const check = await this.CheckNfeUseCase.execute({
      id,
      companyId,
    })
    return response.status(201).json({ check })
  }
}
