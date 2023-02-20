import { Request, Response } from 'express'
import pdf from 'html-pdf'

// import { bufferToStream } from '../../utils/bufferToStream'
import { GetBudgetPdfUseCase } from './GetBudgetPdfUseCase'

export class GetBudgetPdfController {
  constructor(private getBudgetPdfUseCase: GetBudgetPdfUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const budget = await this.getBudgetPdfUseCase.execute(id)
    response.setHeader('Content-type', 'application/pdf')

    pdf
      .create(budget, {
        border: {
          top: '10px',
          right: '10px',
          bottom: '10px',
          left: '10px',
        },
      })
      .toStream(function (_err, stream) {
        stream.pipe(response)
      })
  }
}
