import { Request, Response } from 'express'

import { ExportBradesco400UseCase } from './ExportBradesco400UseCase'

export class ExportBradesco400Controller {
  constructor(private ExportBradesco400UseCase: ExportBradesco400UseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { installmentsSelected: installments, bankAccountId, wallet } = request.body
    const { companyId } = request.user

    const textData = await this.ExportBradesco400UseCase.execute({
      installments,
      companyId,
      bankAccountId,
      wallet,
    })
    response.setHeader('Content-type', 'application/octet-stream')
    response.setHeader('Content-disposition', 'attachment; filename=statement.txt')

    return response.send(textData)
  }
}
