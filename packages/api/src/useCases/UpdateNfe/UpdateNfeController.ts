import { Request, Response } from 'express'

import { UpdateNfeUseCase } from './UpdateNfeUseCase'

export class UpdateNfeController {
  constructor(private UpdateNfeUseCase: UpdateNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId, id: employeeId } = request.user
    const {
      id,
      cliente,
      fornecedor,
      data,
      tipo,
      transpNome,
      frete,
      seguro,
      outrasDespesas,
      freteOutros,
      desconto,
      totalCheque,
      totalDinheiro,
      totalCartaoCredito,
      totalBoleto,
      totalOutros,
      totalCartaoDebito,
      totalNota,
      totalProduto,
      serie,
      estorno,
      complementar,
      naturezaOp,
      observacoes,
      idCountry,
      descCountry,
      nDi,
      dDi,
      xLocDesemb,
      uFDesemb,
      tpViaTransp,
      cExportador,
      transportador,
      products,
      Customer,
      paymentMethodId,
      orderId,
    } = request.body

    const nota = await this.UpdateNfeUseCase.execute({
      id,
      cliente,
      fornecedor,
      data,
      tipo,
      transpNome,
      frete,
      seguro,
      outrasDespesas,
      freteOutros,
      desconto,
      totalCheque,
      totalDinheiro,
      totalCartaoCredito,
      totalBoleto,
      totalOutros,
      totalCartaoDebito,
      totalNota,
      totalProduto,
      serie,
      estorno,
      complementar,
      naturezaOp,
      observacoes,
      idCountry,
      descCountry,
      nDi,
      dDi,
      xLocDesemb,
      uFDesemb,
      tpViaTransp,
      cExportador,
      transportador,
      products,
      companyId,
      Customer,
      paymentMethodId,
      orderId,
      employeeId,
    })

    return response.status(201).json({ nota })
  }
}
