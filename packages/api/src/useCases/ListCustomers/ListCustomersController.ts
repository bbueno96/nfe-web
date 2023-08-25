import { Request, Response } from 'express'

import { ListCustomersUseCase } from './ListCustomersUseCase'

export class ListCustomersController {
  constructor(private listCustomersUseCase: ListCustomersUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { cpfCnpj, name, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const seller = await this.listCustomersUseCase.execute({
      cpfCnpj: cpfCnpj as string,
      name: name as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(seller)
  }
}
