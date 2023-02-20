import { Request, Response } from 'express'

import { ListGroupUseCase } from './ListGroupUseCase'

export class ListGroupController {
  constructor(private listGroupUseCase: ListGroupUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const seller = await this.listGroupUseCase.execute({
      companyId,
      description: description as string,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(seller)
  }
}
