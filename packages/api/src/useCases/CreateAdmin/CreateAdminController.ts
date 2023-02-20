import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'

import { CreateAdminUseCase } from './CreateAdminUseCase'

export class CreateAdminController {
  constructor(private CreateAdminUseCase: CreateAdminUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user

    const { name, login, password } = request.body

    const id = await this.CreateAdminUseCase.execute({
      name,
      login,
      passwordHash: await bcrypt.hash(password, 8),
      companyId,
    })

    return response.status(201).json({ id })
  }
}
