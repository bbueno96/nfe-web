import { Request, Response } from 'express'

import { ListProductsUseCase } from './ListProductsUseCase'

export class ListProductsController {
  constructor(private listProductsUseCase: ListProductsUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy, sort } = request.body
    const { companyId } = request.user
    const products = await this.listProductsUseCase.execute({
      description: description as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
      sort,
    })
    return response.json(products)
  }
}
