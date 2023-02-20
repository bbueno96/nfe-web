/* eslint-disable array-callback-return */
import { Request, Response } from 'express'
// import { merge } from 'merge-pdf-buffers'
import { Readable } from 'stream'

import { mergePdftk } from '../../utils/margePdf'
import { GetBoletoPdfUseCase } from './GetBoletoPdfUseCase'

export class GetBoletoPdfController {
  constructor(private getBoletoPdfUseCase: GetBoletoPdfUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const danfe = await this.getBoletoPdfUseCase.execute(id)
    const merged = await mergePdftk(danfe)
    Readable.from(Buffer.from(merged)).pipe(response)
    response.setHeader('Content-type', 'application/pdf')
  }
}
