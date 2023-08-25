import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { ReadXmlUseCase } from './ReadXmlUseCase'

export class ReadXmlController {
  constructor(private readXmlUseCase: ReadXmlUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { getApoio } = request.body
    const buffer = request.file?.buffer
    const { companyId } = request.user
    return prisma.$transaction(async prismaTransaction => {
      const nfe = await this.readXmlUseCase.execute(
        {
          xml: buffer,
          companyId,
          getApoio: getApoio === 'true',
        },
        prismaTransaction,
      )
      return response.json(nfe)
    })
  }
}
