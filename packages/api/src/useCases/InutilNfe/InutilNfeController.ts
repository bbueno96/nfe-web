import { Request, Response } from 'express'

import { InutilNfeUseCase } from './InutilNfeUseCase'

export class InutilNfeController {
  constructor(private InutilNfeUseCase: InutilNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params
    const inutil = await this.InutilNfeUseCase.execute({
      id,
      companyId,
    })
    return response.status(201).json({ inutil })
  }
}
