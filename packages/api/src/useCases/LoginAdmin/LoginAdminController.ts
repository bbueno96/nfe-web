import { Request, Response } from 'express'

import { LoginAdminUseCase } from './LoginAdminUseCase'

export class LoginAdminController {
  constructor(private loginAdminUseCase: LoginAdminUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { login, password } = request.body

    const data = await this.loginAdminUseCase.execute({
      login,
      password,
    })

    return response.json(data)
  }
}
