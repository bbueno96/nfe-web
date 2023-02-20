import { Request, Response } from 'express'

import { GetPayMethodByIdUseCase } from './GetPayMethodByIdUseCase'

export class GetPayMethodByIdController {
  constructor(private getPayMethodByIdUseCase: GetPayMethodByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const payMethod = await this.getPayMethodByIdUseCase.execute(id)
    return response.json(payMethod)
  }
}
