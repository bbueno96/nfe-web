/* eslint-disable node/no-path-concat */
import { format } from 'date-fns'
import ejs from 'ejs'
import { Request, Response } from 'express'
import pdf from 'html-pdf'

import { ParameterRepository } from '../../repositories/ParameterRepository'
import { maskDecimal } from '../../utils/mask'
import { ListProductsUseCase } from './ListProductsUseCase'

export class ListProductsController {
  constructor(private listProductsUseCase: ListProductsUseCase, private parameterRepository: ParameterRepository) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, cod, barCode, geraPdf = false, page = 1, perPage = 10, orderBy, sort } = request.body
    const { companyId } = request.user
    const products = await this.listProductsUseCase.execute({
      description: description as string,
      cod: cod as string,
      barCode: barCode as string,
      companyId,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
      sort,
    })
    if (geraPdf) {
      response.setHeader('Content-type', 'application/pdf')
      const parameters = await this.parameterRepository.getParameter(companyId)
      const report = await ejs.renderFile(`${__dirname}/../../reports/stock.ejs`, {
        products: products.items,
        parameters,
        format,
        maskDecimal,
        totalQtde: products.items.reduce((acc, curr) => acc + parseFloat('0' + curr.stock), 0),
        totalValue: products.items.reduce(
          (acc, curr) => acc + parseFloat('0' + curr.stock) * parseFloat('0' + curr.value),
          0,
        ),
        printedAt: new Date(),
      })
      await pdf
        .create(report, {
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
    } else return response.json(products)
  }
}
