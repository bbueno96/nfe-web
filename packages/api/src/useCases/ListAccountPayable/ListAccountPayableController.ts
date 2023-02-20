import { Request, Response } from 'express'

import { ListAccountPayableUseCase } from './ListAccountPayableUseCase'

export class ListAccountPayableController {
  constructor(private listAccountPayableUseCase: ListAccountPayableUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      minCreatedAtDate,
      maxCreatedAtDate,
      minDueDate,
      maxDueDate,
      providerId,
      document,
      isPaid,
      page = 1,
      perPage = 10,
      orderBy,
    } = request.body
    const { companyId } = request.user
    const payable = await this.listAccountPayableUseCase.execute({
      minCreatedAtDate,
      maxCreatedAtDate,
      minDueDate,
      maxDueDate,
      providerId,
      document,
      isPaid,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
      companyId,
    })
    return response.json(payable)
  }
}
