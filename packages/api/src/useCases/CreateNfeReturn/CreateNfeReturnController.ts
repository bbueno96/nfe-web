import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateNfeReturnUseCase } from './CreateNfeReturnUseCase'

export class CreateNfeReturnController {
  constructor(private CreateNfeReturnUseCase: CreateNfeReturnUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { nota } = request.body
    return prisma.$transaction(async prismaTransaction => {
      const id = await this.CreateNfeReturnUseCase.execute(nota, prismaTransaction)

      return response.status(201).json({ id })
    })
  }
}
