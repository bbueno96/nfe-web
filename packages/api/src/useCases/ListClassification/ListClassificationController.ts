import { Request, Response } from 'express'

import { ListClassificationUseCase } from './ListClassificationUseCase'

export class ListClassificationController {
  constructor(private listClassificationUseCase: ListClassificationUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const classification = await this.listClassificationUseCase.execute({
      description: description as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(classification)
  }
}
