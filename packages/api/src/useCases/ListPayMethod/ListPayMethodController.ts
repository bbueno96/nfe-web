import { Request, Response } from 'express'

import { ListPayMethodUseCase } from './ListPayMethodUseCase'

export class ListPayMethodController {
  constructor(private listPayMethodUseCase: ListPayMethodUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const payMethod = await this.listPayMethodUseCase.execute({
      description: description as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(payMethod)
  }
}
