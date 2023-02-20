import { Request, Response } from 'express'

import { ListBrandUseCase } from './ListBrandUseCase'

export class ListBrandController {
  constructor(private listBrandUseCase: ListBrandUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const seller = await this.listBrandUseCase.execute({
      description: description as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(seller)
  }
}
