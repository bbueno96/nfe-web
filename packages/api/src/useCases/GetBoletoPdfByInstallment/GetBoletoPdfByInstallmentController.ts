/* eslint-disable array-callback-return */
import { Request, Response } from 'express'
// import { merge } from 'merge-pdf-buffers'
import { Readable } from 'stream'

import { mergePdftk } from '../../utils/margePdf'
import { GetBoletoPdfByInstallmentUseCase } from './GetBoletoPdfByInstallmentUseCase'

export class GetBoletoPdfByInstallmentController {
  constructor(private getBoletoPdfByInstallmentUseCase: GetBoletoPdfByInstallmentUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const bankSlip = await this.getBoletoPdfByInstallmentUseCase.execute(id)
    const merged = await mergePdftk(bankSlip)
    Readable.from(Buffer.from(merged)).pipe(response)
    response.setHeader('Content-type', 'application/pdf')
  }
}
