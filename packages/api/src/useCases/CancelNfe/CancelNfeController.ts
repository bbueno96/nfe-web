import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CancelNfeUseCase } from './CancelNfeUseCase'

export class CancelNfeController {
  constructor(private CancelNfeUseCase: CancelNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId, id: employeeId } = request.user
    const { id } = request.params

    return prisma.$transaction(async prismaTransaction => {
      const cancel = await this.CancelNfeUseCase.execute(
        {
          id,
          companyId,
          employeeId,
        },
        prismaTransaction,
      )
      return response.status(201).json({ cancel })
    })
  }
}
