import { Request, Response } from 'express'

import { CancelNfeUseCase } from './CancelNfeUseCase'

export class CancelNfeController {
  constructor(private CancelNfeUseCase: CancelNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params

    const cancel = await this.CancelNfeUseCase.execute({
      id,
      companyId,
    })
    return response.status(201).json({ cancel })
  }
}
