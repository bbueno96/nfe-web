import { Request, Response } from 'express'

import { ListTaxSituationPostUseCase } from './ListTaxSituationPostUseCase'

export class ListTaxSituationPostController {
  constructor(private listTaxSituationPostUseCase: ListTaxSituationPostUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, page = 1, perPage = 10, orderBy } = request.body
    const { companyId } = request.user
    const taxSituation = await this.listTaxSituationPostUseCase.execute({
      description: description as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
    })
    return response.json(taxSituation)
  }
}
