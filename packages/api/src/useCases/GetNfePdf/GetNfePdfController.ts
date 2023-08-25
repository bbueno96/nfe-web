import { Request, Response } from 'express'

// import { bufferToStream } from '../../utils/bufferToStream'
import { GetNfePdfUseCase } from './GetNfePdfUseCase'

export class GetNfePdfController {
  constructor(private getNfePdfUseCase: GetNfePdfUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const danfe = await this.getNfePdfUseCase.execute(id)

    if (danfe !== undefined) {
      response.setHeader('Content-type', 'application/pdf')
      danfe.pipe(response)
    } else {
      return response.json({ menssage: 'Nfe ainda não salva' })
    }
  }
}
