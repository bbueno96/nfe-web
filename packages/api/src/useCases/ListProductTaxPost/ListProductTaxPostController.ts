import { Request, Response } from 'express'

import { ListProductTaxPostUseCase } from './ListProductTaxPostUseCase'

export class ListProductTaxPostController {
  constructor(private listProductTaxPostUseCase: ListProductTaxPostUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { product, uf, page = 1, perPage = 10, orderBy } = request.body
    const taxSituation = await this.listProductTaxPostUseCase.execute({
      product: product as string,
      uf: uf as string,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(taxSituation)
  }
}
