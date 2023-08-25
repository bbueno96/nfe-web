import { Request, Response } from 'express'

import { ListNfeUseCase } from './ListNfeUseCase'

export class ListNfeController {
  constructor(private listNfeUseCase: ListNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      cpfCnpj,
      minDate,
      maxDate,
      name,
      customerApoioProperty,
      page = 1,
      perPage = 10,
      orderBy,
      tipo,
    } = request.body
    const { companyId } = request.user
    const seller = await this.listNfeUseCase.execute({
      cpfCnpj: cpfCnpj as string,
      companyId,
      tipo,
      minDate,
      maxDate,
      customerApoioProperty,
      name: name as string,
      page,
      perPage,
      orderBy: orderBy as string,
    })
    return response.json(seller)
  }
}
