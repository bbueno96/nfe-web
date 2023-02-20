import { Request, Response } from 'express'

import { SendAuthNfeUseCase } from './SendAuthNfeUseCase'

export class SendAuthNfeController {
  constructor(private SendAuthNfeUseCase: SendAuthNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params

    const retNota = await this.SendAuthNfeUseCase.execute({
      id,
      companyId,
    })
    return response.status(201).json({ retNota })
  }
}
