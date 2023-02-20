import { Request, Response } from 'express'

import { ExportSicredi240UseCase } from './ExportSicredi240UseCase'

export class ExportSicredi240Controller {
  constructor(private ExportSicredi240UseCase: ExportSicredi240UseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { installmentsSelected, bankAccountId, wallet } = request.body
    const { companyId } = request.user

    const textData = await this.ExportSicredi240UseCase.execute({
      installments: installmentsSelected,
      companyId,
      bankAccountId,
      wallet,
    })
    response.setHeader('Content-type', 'application/octet-stream')
    response.setHeader('Content-disposition', 'attachment; filename=statement.txt')

    return response.send(textData)
  }
}
