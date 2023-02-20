import { Request, Response } from 'express'

import { GetParameterUseCase } from './GetParameterUseCase'

export class GetParameterController {
  constructor(private getParameterUseCase: GetParameterUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { serie = null } = request.body

    const parameter = await this.getParameterUseCase.execute(companyId, serie)
    return response.json(parameter)
  }
}
