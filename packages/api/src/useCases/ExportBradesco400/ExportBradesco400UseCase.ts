import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

import { Installment } from '../../entities/Installment'
import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { Cities } from '../../utils/constants'
import { IExportBradesco400DTO } from './ExportBradesco400DTO'

export class ExportBradesco400UseCase {
  constructor(
    private installmentRepository: InstallmentRepository,
    private parameterRepository: ParameterRepository,
    private customerRepository: CustomerRepository,
    private bankAccountRepository: BankAccountRepository,
  ) {}

  validate(data: IExportBradesco400DTO) {
    if (!data.installments) {
      throw new ApiError('Informe ao menos uma parcela.', 422)
    }
    if (!data.bankAccountId) {
      throw new ApiError('Conta obrigatoria.', 422)
    }
  }

  async execute(data: IExportBradesco400DTO) {
    await this.validate(data)
    let fileData = ''
    const parameters = await this.parameterRepository.getParameter(data.companyId)
    let sequential = 1
    const bankAccount = await this.bankAccountRepository.findById(data.bankAccountId)
    bankAccount.sequenceLot++
    const wallet = `${data.wallet}`.padStart(3, '0')
    const agency = `${bankAccount.agency}`.padStart(5, '0')
    const numberDv = `${bankAccount.number}`.padStart(7, '0') + bankAccount.verifyingDigit
    // Registro Header do Arquivo
    fileData += '0' // 1.0  Identificação do Registro  (tam: 1 valor fixo: 0) 001-001
    fileData += '1' // 2.0 Identificação do Arquivo-Remessa  (tam: 1 valor fixo: 1) 002-002
    fileData += 'REMESSA' // 3.0  Literal Remessa  (tam: 7 valor fixo: REMESSA) 003-009
    fileData += '01' // 4.0 Código de Serviço  (tam: 2 valor fixo:01 ) 010-011
    fileData += `COBRANCA`.padEnd(15, ' ') // 5.0 Literal Serviço   (tam: 15 fixo: COBRANCA) 012-026
    fileData += `${5576623}`.padStart(20, '0') // 6.0 Código da Empresa  (tam: 20) 027-046
    fileData += `${parameters.nfeRazao.length > 30 ? parameters.nfeRazao.slice(0, 30) : parameters.nfeRazao}`.padEnd(
      30,
      ' ',
    ) // 7.0 Nome da Empresa  (tam: 30) 047-076
    fileData += `237` // 8.0 Número do Bradesco na Câmara de Compensação (tam: 5 fixo:237) 077-079
    fileData += `BRADESCO`.padEnd(15, ' ') // 9.0 Nome do Banco por Extenso  (tam: 15) 080-094
    fileData += `${format(new Date(), 'ddMMyy')}` // 10.0 Data da Gravação do Arquivo (tam: 6) 095-100
    fileData += ``.padStart(8, ' ') // 11.0 Branco  (tam: 8) 101-108
    fileData += `MX` // 12.0 Identificação do Sistema (tam: 2 fixo: MX) 109-110
    fileData += `${bankAccount.sequenceLot}`.padStart(7, '0') // 13.0  Nº Sequencial de Remessa  (tam: 7) 111-117
    fileData += ``.padEnd(277, ' ') // 14.0 Branco (tam: 277 fixo: ) 118-394
    fileData += `1`.padStart(6, '0') // 15.0 Nº Sequencial do Registro de Um em Um (tam: 006 fixo: 1) 395-400
    fileData += `\r\n`
    sequential += 1
    for (let i = 0; i < data.installments.length; i++) {
      const installment = data.installments[i]
      let customer = null
      if (parameters.getApoio) {
        const i = await this.installmentRepository.findById(installment.id)
        customer = {
          cpfCnpj: i.cpfCnpjApoio,
          name: i.customerApoioName,
          address: i.addressApoio,
          addressNumber: i.addressNumberApoio,
          postalCode: i.postalCodeApoio,
          cityId: Cities.find(city => city.id === i.cityIdApoio).id,
          state: i.stateApoio,
        }
      } else customer = await this.customerRepository.findById(installment.customerId)
      const dueDate = new Date(installment.dueDate)
      // - Registro de Transação - Tipo 1
      try {
        fileData += '1' // 1.1 Identificação do Registro  (tam: 1 valor fixo: 1) 001-001
        fileData += ''.padEnd(5, '0') // 2.1  Agência de Débito (opcional)   (tam: 5) 002-006
        fileData += '0' // 3.1 Dígito da Agência de Débito (opcional)   (tam: 1 ) 007-007
        fileData += ''.padEnd(5, '0') // 4.1  Razão da Conta-Corrente (opcional)  (tam: 5 ) 008-012
        fileData += ''.padEnd(7, '0') // 5.1 Conta-Corrente (opcional) (tam: 7) 012-019
        fileData += '0' // 6.1 Dígito da Conta-Corrente (opcional)   (tam: 1 ) 020-020
        fileData += `${wallet}${agency}${numberDv}`.padStart(17, '0') // 7.1Identificação da Empresa Beneficiária no Banco   (tam: 17) 021-037
        fileData += `${installment.numeroDoc}/${installment.numberInstallment}`.padEnd(25, ' ') // 8.1 Nº Controle do Participante   (tam: 25) 038-062
        fileData += `000` // 9.1 Código do Banco a ser debitado na Câmara de Compensação    (tam: 3) 063-065
        fileData += `${installment.interest > 0 ? 2 : 0}` // 10.1 Campo de Multa Se = 2 considerar percentual de multa. Se = 0, sem multa  (tam: 1) 066-066
        fileData += `${parseFloat(installment.interest).toFixed(2).replace('.', '')}`.padStart(4, '0') // 11.1  Percentual de Multa (tam: 4) 067-070
        fileData += `${installment.ourNumber}`.padStart(12, '0') // 12.1 Identificação do Título no Banco (tam: 12) 071-082
        fileData += ``.padStart(10, '0') // 14.1 Desconto Bonificação por dia (tam: 10) 083 - 092
        fileData += `2` // 15.1 Condição para Emissão da Papeleta de Cobrança (tam: 1) 093 - 093
        fileData += `N` // 16.1  Ident. se emite Boleto para Débito  Automático (tam: 1) 094 - 094
        fileData += ``.padEnd(10, ' ') // 17.1   Identificação da Operação do Banco (tam: 10) 095 - 104
        fileData += ` ` // 18.1   Indicador Rateio Crédito (opcional) (tam: 1) 105 - 105
        fileData += `0` // 19.1    Endereçamento para Aviso do Débito Automático em Conta-Corrente (opcional) (tam: 1) 106 - 106
        fileData += ``.padEnd(2, ' ') // 20.1   Quantidade de Pagamentoso (tam: 2) 107 - 108
        fileData += `01` // 20.1   Identificação da Ocorrência (tam: 2) 109 - 110
        fileData += `${installment.numeroDoc}/${installment.numberInstallment}`.padEnd(10, ' ') // 21.1  Nº do Documento   (tam: 10) 111-120
        fileData += `${format(dueDate, 'ddMMyy')}` // 22.1  Data do Vencimento do Título   (tam: 6) 121-126
        fileData += `${parseFloat(installment.value).toFixed(2).replace('.', '')}`.padStart(13, '0') // 23.1 Valor do Título  (tam: 13) 127-139
        fileData += ``.padStart(3, '0') // 24.1 Banco Encarregado da Cobrança  (tam: 3) 140 a 142
        fileData += ``.padStart(5, '0') // 25.1  Agência Depositária (tam: 5) 143 a 147
        fileData += `01` // 26.1 Espécie de Título (tam: 2) 148 a 149
        fileData += `N` // 27.1 Identificação (tam:1) 150 a 150
        fileData += `${format(new Date(installment.createdAt), 'ddMMyy')}` // 28.1 Data da Emissão do Título (tam:6) 151 a 156
        fileData += `00` // 29.1 1ª Instrução(tam:2) 157 a 158
        fileData += `00` // 30.1 2ª Instrução(tam:2) 159 a 160
        fileData += `${((installment.fine / 100) * parseFloat(installment.value))
          .toFixed(2)
          .replace('.', '')}`.padStart(13, '0') // 31.1 Valor a ser Cobrado por Dia de Atraso (tam:13) 161 a 173
        fileData += ``.padStart(6, '0') // 32.1  Data Limite P/Concessão de Desconto (tam: 6) 174 a 179
        fileData += ``.padStart(13, '0') // 33.1   Valor do Desconto (tam: 13) 180 a 192
        fileData += ``.padStart(13, '0') // 34.1   Valor do IOF (tam: 13) 193 a 205
        fileData += ``.padStart(13, '0') // 35.1   Valor do Abatimento a ser Concedido ou Cancelado  (tam: 13) 193 a 205
        fileData += `${customer.cpfCnpj.length === 11 ? '01' : '02'}` // 36.1 Identificação do Tipo de Inscrição do  Pagador  (tam: 2) 219 a 220
        fileData += `${customer.cpfCnpj}`.padStart(14, '0') // 37.1   Nº Inscrição do Pagador  (tam: 14) 221 a 234
        fileData += `${customer.name.length > 40 ? customer.name.slice(0, 40) : customer.name}`.padStart(40, ' ') // 38.1   Nome do Pagador (tam: 40) 235 a 274
        fileData += `${customer.address.length > 40 ? customer.address.slice(0, 40) : customer.address}, ${
          customer.addressNumber
        }`.padStart(40, ' ') // 39.1   Endereço do Pagador(tam: 40)  275 a 314
        fileData += ``.padEnd(12, ' ') // 40.1 1ª Mensagem (tam: 12) 315 a 326
        fileData += `${customer.postalCode}`.padStart(8, '0') // 41.1 CEP e Sufixo do CEP  (tam: 5) 327 a 334
        fileData += `TITULO SUJEITO A NEGATICAO APOS 5 DIAS UTEIS DE VENCIDO.`.padEnd(60, ' ') // 42.1 CEP e Sufixo do CEP  (tam: 60) 335 a 394
        fileData += `${sequential}`.padStart(6, '0') // 43.1 Nº Sequencial do Registro (tam 6) 395 a 400
        fileData += `\r\n`
        sequential += 1
      } catch (err) {
        console.log(err)
      }
    }

    // Registro Trailler do Arquivo
    fileData += '9' // 1.9   Identificação Registro (tam: 1 valor fixo: 9) 001-001
    fileData += ''.padEnd(393, ' ') // 2.9 Branco  (tam: 393 valor fixo: ) 002-394
    fileData += `${(fileData.match(/\r\n/g) || []).length + 1}`.padStart(6, '0') // 3.9 Número Sequencial de Registro (tam: 6 valor fixo: ) 395-400
    fileData += `\r\n`
    sequential += 1
    await this.bankAccountRepository.update(bankAccount)
    const bankSlipStorege = await this.installmentRepository.saveLot({
      id: uuidv4(),
      numberLot: bankAccount.sequenceLot,
      conteudo: fileData,
      companyId: data.companyId,
      bankAccountId: data.bankAccountId,
      wallet: data.wallet,
      createdAt: new Date(),
    })
    data.installments.forEach(async e => {
      const installment = await this.installmentRepository.findById(e.id)
      await this.installmentRepository.update({
        ...installment,
        BankRemittanceId: bankSlipStorege.id,
        createdAt: new Date(e.createdAt),
        dueDate: new Date(e.dueDate),
      })
    })
    return fileData
  }
}
