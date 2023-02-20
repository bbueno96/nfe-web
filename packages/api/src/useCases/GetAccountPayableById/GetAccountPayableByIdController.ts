import { Request, Response } from 'express'

import { GetAccountPayableByIdUseCase } from './GetAccountPayableByIdUseCase'

export class GetAccountPayableByIdController {
  constructor(private getAccountPayableByIdUseCase: GetAccountPayableByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const accountPayable = await this.getAccountPayableByIdUseCase.execute(id)
    return response.json(accountPayable)
  }
}
