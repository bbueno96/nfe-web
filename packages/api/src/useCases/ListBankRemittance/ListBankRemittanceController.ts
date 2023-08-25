import { Request, Response } from 'express'

import { ListBankRemittanceUseCase } from './ListBankRemittanceUseCase'

export class ListBankRemittanceController {
  constructor(private listBrandUseCase: ListBankRemittanceUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      minCreatedAtDate,
      maxCreatedAtDate,
      bankAccountId,
      numberLot,
      page = 1,
      perPage = 10,
      orderBy = 'desc',
    } = request.body
    const { companyId } = request.user
    const seller = await this.listBrandUseCase.execute({
      numberLot,
      companyId,
      bankAccountId,
      minCreatedAtDate,
      maxCreatedAtDate,
      page,
      perPage,
      orderBy: orderBy as string,
    })
    return response.json(seller)
  }
}
