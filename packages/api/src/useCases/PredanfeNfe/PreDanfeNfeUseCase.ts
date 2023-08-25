import { addMinutes } from 'date-fns'

import { PrismaTransaction } from '../../../prisma/types'
import { Nfe } from '../../entities/Nfe'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { preDanfeNFe } from '../../utils/nfe/preDanfe'
import { IPreDanfeNfeDTO } from './PreDanfeNfeDTO'

export class PreDanfeNfeUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private customerRepository: CustomerRepository,
    private parameterRepository: ParameterRepository,
  ) {}

  async execute(data: IPreDanfeNfeDTO, prismaTransaction: PrismaTransaction) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    if (!parameter) {
      throw new ApiError('Nenhuma configuração encontrada.', 404)
    }
    const nfe = await this.nfeRepository.findById(data.id || '')
    if (!nfe) {
      throw new ApiError('Nenhuma nota encontrada.', 404)
    }

    let totalProdutos = 0
    const updateNota: Nfe = nfe
    updateNota.chave = nfe.chave || null
    updateNota.dataSaida = addMinutes(new Date(), 60)
    updateNota.processado = true
    totalProdutos = totalProdutos + Number(nfe.qtdeProdutos) * 850 + 6550
    if (totalProdutos < 500000) {
      if (nfe.tipo === 'SAIDA') {
        const observacoes = nfe.observacoes || ''

        updateNota.observacoes = observacoes

        const nota = await this.nfeRepository.update(nfe?.id, { id: nfe.id, ...updateNota }, prismaTransaction)
        const recibo = await preDanfeNFe(nota.id, parameter)
        return recibo
      }
    } else {
      await this.nfeRepository.update(
        nfe?.id,
        {
          ...nfe,
          status: 'erro',
          erros: 'Tamanho Arquivo excedeu 500kB. Faça notas máximo 500 itens.',
        },
        prismaTransaction,
      )
    }
  }
}
