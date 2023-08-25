import { Request, Response } from 'express'

import { EmailNfeUseCase } from './EmailNfeUseCase'

export class EmailNfeController {
  constructor(private EmailNfeUseCase: EmailNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params

    const email = await this.EmailNfeUseCase.execute({
      id,
      companyId,
    })
    return response.status(201).json({ email })
  }
}
