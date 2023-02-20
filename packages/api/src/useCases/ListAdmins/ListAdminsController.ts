import { Request, Response } from 'express'

import { ListAdminsUseCase } from './ListAdminsUseCase'

export class ListAdminsController {
  constructor(private listAdminsUseCase: ListAdminsUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { name, page = 1, perPage = 10, orderBy, sort } = request.body
    const { companyId } = request.user
    const admins = await this.listAdminsUseCase.execute({
      name: name as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(admins)
  }
}
