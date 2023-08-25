import { Request, Response } from 'express'

import { ListProductStockPostUseCase } from './ListProductStockPostUseCase'

export class ListProductStockPostController {
  constructor(private listProductStockPostUseCase: ListProductStockPostUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { product } = request.body
    const { companyId } = request.user
    const StockSituation = await this.listProductStockPostUseCase.execute({
      product: product as string,
      companyId,
    })
    return response.json(StockSituation)
  }
}
