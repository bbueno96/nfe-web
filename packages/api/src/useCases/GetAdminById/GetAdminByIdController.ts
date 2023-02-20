import { Request, Response } from 'express'

import { GetAdminByIdUseCase } from './GetAdminByIdUseCase'

export class GetAdminByIdController {
  constructor(private getAdminByIdUseCase: GetAdminByIdUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const admin = await this.getAdminByIdUseCase.execute(id)
    return response.json(admin)
  }
}
