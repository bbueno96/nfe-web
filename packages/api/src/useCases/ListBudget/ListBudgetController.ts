import { Request, Response } from 'express'

import { ListBudgetUseCase } from './ListBudgetUseCase'

export class ListBudgetController {
  constructor(private listBudgetUseCase: ListBudgetUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { customer, cpfCnpj, customerApoioProperty, name, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const seller = await this.listBudgetUseCase.execute({
      customer: customer as string,
      cpfCnpj: cpfCnpj as string,
      customerApoioProperty: customerApoioProperty as string,
      name: name as string,
      companyId,
      page,
      perPage,
      orderBy: orderBy as string,
    })
    return response.json(seller)
  }
}
