import { Request, Response } from 'express'

import { GetInstallmentByIdUseCase } from './GetInstallmentByIdUseCase'

export class GetInstallmentByIdController {
  constructor(private getInstallmentByIdUseCase: GetInstallmentByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const accountPayable = await this.getInstallmentByIdUseCase.execute(id)
    return response.json(accountPayable)
  }
}
