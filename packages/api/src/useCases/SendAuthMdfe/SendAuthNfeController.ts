import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { SendAuthNfeUseCase } from './SendAuthNfeUseCase'

export class SendAuthNfeController {
  constructor(private SendAuthNfeUseCase: SendAuthNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params

    return prisma.$transaction(async prismaTransaction => {
      const retNota = await this.SendAuthNfeUseCase.execute(
        {
          id,
          companyId,
        },
        prismaTransaction,
      )
      return response.status(201).json({ retNota })
    })
  }
}
