/* eslint-disable node/no-path-concat */
import { format } from 'date-fns'
import ejs from 'ejs'

import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { PaymentMean } from '../../utils/constants'
import { createInstallmentsOrder } from '../../utils/Installments/installments'
import { maskCpfCnpj, maskDecimal, maskCellPhone } from '../../utils/mask'
export class GetOrderPdfUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private parameterRepository: ParameterRepository,
    private OrderProductsRepository: OrderProductsRepository,
  ) {}

  async execute(id: string) {
    const order = await this.orderRepository.findById(id)
    if (!order) {
      throw new ApiError('Pedido não encontrado.', 404)
    }
    const parameters = await this.parameterRepository.getParameter(order.companyId || '')
    const { Admin, PayMethod } = order
    const { Customer } = order
    let CustomerApoio
    if (parameters?.getApoio) {
      CustomerApoio = {
        name: order.customerApoioName,
        cpfCnpj: order.cpfCnpjApoio,
        stateInscription: order.stateInscriptionApoio,
        address: order.addressApoio,
        addressNumber: order.addressNumberApoio,
        complement: order.complementApoio,
        province: order.provinceApoio,
        cityId: order.cityIdApoio,
        state: order.stateApoio,
        postalCode: order.postalCodeApoio,
        phone: order.phoneApoio,
      }
    }
    let installments
    const products = await this.OrderProductsRepository.findByOrder(order.id)
    // if (PayMethod) installments = createInstallments(PayMethod, order, order.companyId)
    if (order.installments) installments = createInstallmentsOrder(order, order.companyId)
    const report = await ejs.renderFile(`${__dirname}/../../reports/order.ejs`, {
      customer: CustomerApoio || Customer,
      products,
      order,
      parameters,
      employee: Admin,
      printedAt: new Date(),
      format,
      maskDecimal,
      maskCpfCnpj,
      maskCellPhone,
      PayMethod,
      installments,
      PaymentMean,
    })
    return report
  }
}
