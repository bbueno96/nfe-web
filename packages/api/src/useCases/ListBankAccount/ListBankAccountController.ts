import { Request, Response } from 'express'

import { ListBankAccountUseCase } from './ListBankAccountUseCase'

export class ListBankAccountController {
  constructor(private listBankAccountUseCase: ListBankAccountUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const bankAccount = await this.listBankAccountUseCase.execute({
      description: description as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(bankAccount)
  }
}
