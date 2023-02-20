import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'

import { UpdateAdminUseCase } from './UpdateAdminUseCase'

export class UpdateAdminController {
  constructor(private UpdateAdminUseCase: UpdateAdminUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id, name, login, password } = request.body

    const admin = await this.UpdateAdminUseCase.execute({
      id,
      name,
      login,
      passwordHash: await bcrypt.hash(password, 8),
      companyId,
    })
    return response.status(201).json({ admin })
  }
}
