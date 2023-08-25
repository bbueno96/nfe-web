import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { PreDanfeNfeUseCase } from './PreDanfeNfeUseCase'

export class PreDanfeNfeController {
  constructor(private preDanfeNfeUseCase: PreDanfeNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params

    return prisma.$transaction(async prismaTransaction => {
      const retNota = await this.preDanfeNfeUseCase.execute(
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
