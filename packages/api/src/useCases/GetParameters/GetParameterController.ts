import { Request, Response } from 'express'

import { GetParameterUseCase } from './GetParameterUseCase'

export class GetParameterController {
  constructor(private getParameterUseCase: GetParameterUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user

    const parameter = await this.getParameterUseCase.execute(companyId)
    return response.json(parameter)
  }
}
