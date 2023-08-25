import { Request, Response } from 'express'

import { ListAdminsUseCase } from './ListAdminsUseCase'

export class ListAdminsController {
  constructor(private listAdminsUseCase: ListAdminsUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { name, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const admins = await this.listAdminsUseCase.execute({
      name: name as string,
      companyId,
      page,
      perPage,
      orderBy: orderBy as string,
    })
    return response.json(admins)
  }
}
