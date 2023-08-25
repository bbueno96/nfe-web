import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { ValidationNfeUseCase } from './ValidationNfeUseCase'

export class ValidationNfeController {
  constructor(private ValidationNfeUseCase: ValidationNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id } = request.params

    return prisma.$transaction(async prismaTransaction => {
      const check = await this.ValidationNfeUseCase.execute(
        {
          id,
          companyId,
        },
        prismaTransaction,
      )
      return response.status(201).json({ check })
    })
  }
}
