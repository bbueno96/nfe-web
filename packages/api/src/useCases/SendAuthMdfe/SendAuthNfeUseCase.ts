import { addMinutes } from 'date-fns'

import { CustomerRepository } from '../../repositories/CustomerRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { formatPhone } from '../../utils/formatPhone'
import { check } from '../../utils/nfe/check'
import { sendNFe } from '../../utils/nfe/send'
import { ISendAuthNfeDTO } from './SendAuthNfeDTO'

export class SendAuthNfeUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private customerRepository: CustomerRepository,
    private parameterRepository: ParameterRepository,
  ) {}

  validate(data) {
    if (data.status !== 'Validado') {
      throw new ApiError('Nfe Presica estar com o status Validado, Verifique!.', 422)
    }
  }

  async execute(data: ISendAuthNfeDTO) {
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    const nfe = await this.nfeRepository.findById(data.id)
    await this.validate(nfe)

    let totalProdutos = 0
    const updateNota: any = {}
    updateNota.chave = nfe.chave || null
    updateNota.dataSaida = addMinutes(new Date(), 60)
    updateNota.processado = true
    totalProdutos = totalProdutos + Number(nfe.qtdeProdutos) * 850 + 6550
    if (totalProdutos < 500000) {
      if (nfe.tipo === 'SAIDA') {
        const observacoes = nfe.observacoes || ''

        updateNota.observacoes = observacoes

        const nota = await this.nfeRepository.update({ id: nfe.id, ...updateNota })
        const recibo = await sendNFe(nota.id, parameter)
        const retorno = await check(recibo, parameter)
        return retorno
      }
    } else {
      await this.nfeRepository.update({
        ...nfe,
        status: 'erro',
        erros: 'Tamanho Arquivo excedeu 500kB. Faça notas máximo 500 itens.',
      })
    }
  }
}
