import { Request, Response } from 'express'

import { prisma } from '../../prisma'
import { CreateNfeInputUseCase } from './CreateNfeInputUseCase'

export class CreateNfeInputController {
  constructor(private CreateNfeInputUseCase: CreateNfeInputUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    const { companyId, id: employeeId } = request.user
    const {
      fornecedor,
      data,
      numeroNota,
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
      Fornecedor,
      installments,
      especie = 'Vol',
      pesoBruto,
      pesoLiquido,
      valorICMS,
      baseICMS,
      valorTributo,
      dataSaida,
      vIpi,
      vST,
    } = request.body
    return prisma.$transaction(async prismaTransaction => {
      const id = await this.CreateNfeInputUseCase.execute(
        {
          fornecedor,
          data,
          numeroNota: parseInt(numeroNota),
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
          serie: parseInt(serie),
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
          Fornecedor,
          installments,
          especie,
          pesoBruto,
          pesoLiquido,
          valorICMS,
          baseICMS,
          valorTributo,
          dataSaida,
          vIpi,
          vST,
          employeeId,
        },
        prismaTransaction,
      )

      return response.status(201).json({ id })
    })
  }
}
