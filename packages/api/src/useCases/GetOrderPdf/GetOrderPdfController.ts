import { Request, Response } from 'express'
import pdf from 'html-pdf'

// import { bufferToStream } from '../../utils/bufferToStream'
import { GetOrderPdfUseCase } from './GetOrderPdfUseCase'

export class GetOrderPdfController {
  constructor(private getOrderPdfUseCase: GetOrderPdfUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { id } = request.params
    const order = await this.getOrderPdfUseCase.execute(id)
    response.setHeader('Content-type', 'application/pdf')

    pdf
      .create(order, {
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
