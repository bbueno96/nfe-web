import { Request, Response } from 'express'

// import { bufferToStream } from '../../utils/bufferToStream'
import { GetNfeXmlUseCase } from './GetNfeXmlUseCase'

export class GetNfeXmlController {
  constructor(private getNfeXmlUseCase: GetNfeXmlUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const danfe = await this.getNfeXmlUseCase.execute(id)

    if (danfe !== undefined) {
      response.setHeader('Content-type', 'application/xml')
      danfe.pipe(response)
    } else {
      return response.json({ menssage: 'Nfe ainda não salva' })
    }
  }
}
