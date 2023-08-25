import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { UpdateNfeUseCase } from './UpdateNfeUseCase'

export class UpdateNfeController {
  constructor(private UpdateNfeUseCase: UpdateNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
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
      placaTransp,
      ufTransp,
      rntrcTransp,
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
      installments,
      paymentMean,
      propertyId,
      customerApoioProperty,
      tipoFrete,
    } = request.body

    return prisma.$transaction(async prismaTransaction => {
      const nota = await this.UpdateNfeUseCase.execute(
        {
          id,
          cliente,
          fornecedor,
          data,
          tipo,
          transpNome,
          frete,
          seguro,
          placaTransp,
          ufTransp,
          rntrcTransp,
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
          installments,
          paymentMean,
          propertyId,
          customerApoioProperty,
          tipoFrete,
        },
        prismaTransaction,
      )

      return response.status(201).json({ nota })
    })
  }
}
