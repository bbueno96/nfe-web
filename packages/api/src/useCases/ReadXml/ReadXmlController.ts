import { Request, Response } from 'express'

import { ReadXmlUseCase } from './ReadXmlUseCase'

export class ReadXmlController {
  constructor(private readXmlUseCase: ReadXmlUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { getApoio } = request.body
    const buffer = request.file?.buffer
    const { companyId } = request.user
    const nfe = await this.readXmlUseCase.execute({
      xml: buffer,
      companyId,
      getApoio: getApoio === 'true',
    })

    return response.json(nfe)
  }
}
