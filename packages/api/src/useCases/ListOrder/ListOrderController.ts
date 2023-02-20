import { Request, Response } from 'express'

import { ListOrderUseCase } from './ListOrderUseCase'

export class ListOrderController {
  constructor(private listOrderUseCase: ListOrderUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const order = await this.listOrderUseCase.execute({
      customer: description as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(order)
  }
}
