import { Request, Response } from 'express'

import { ListBankRemittanceUseCase } from './ListBankRemittanceUseCase'

export class ListBankRemittanceController {
  constructor(private listBrandUseCase: ListBankRemittanceUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { numberLot, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const seller = await this.listBrandUseCase.execute({
      numberLot,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(seller)
  }
}
