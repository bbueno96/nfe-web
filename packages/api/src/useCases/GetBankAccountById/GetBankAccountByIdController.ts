import { Request, Response } from 'express'

import { GetBankAccountByIdUseCase } from './GetBankAccountByIdUseCase'

export class GetBankAccountByIdController {
  constructor(private getBankAccountByIdUseCase: GetBankAccountByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const bankAccount = await this.getBankAccountByIdUseCase.execute(id)
    return response.json(bankAccount)
  }
}
