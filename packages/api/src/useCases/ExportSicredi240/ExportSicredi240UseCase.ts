import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

import { BankSlipStorege } from '../../entities/BankSlipStorege'
import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { Cities } from '../../utils/constants'
import { IExportSicredi240DTO } from './ExportSicredi240DTO'

export class ExportSicredi240UseCase {
  constructor(
    private installmentRepository: InstallmentRepository,
    private parameterRepository: ParameterRepository,
    private customerRepository: CustomerRepository,
    private bankAccountRepository: BankAccountRepository,
  ) {}

  validate(data: IExportSicredi240DTO) {
    if (!data.installments) {
      throw new ApiError('Informe ao menos uma parcela.', 422)
    }
    if (!data.bankAccountId) {
      throw new ApiError('Conta obrigatoria.', 422)
    }
  }

  async execute(data: IExportSicredi240DTO) {
    await this.validate(data)
    let fileData = ''
    const parameters = await this.parameterRepository.getParameter(data.companyId)
    let sequential = 1
    const bankAccount = await this.bankAccountRepository.findById(data.bankAccountId)

    bankAccount.sequenceLot++

    // Registro Header do Arquivo
    fileData += '748' // 1.0  Código do Banco Sicredi  (tam: 3 valor fixo: 748) 001-003
    fileData += ''.padEnd(4, '0') // 2.0  Lote  (tam: 4 valor fixo: 0000) 004-007
    fileData += ''.padEnd(1, '0') // 3.0  Registro  (tam: 1 valor fixo: 0) 007-007
    fileData += ''.padEnd(9, ' ') // 4.0  CNAB  (tam: 9 valor fixo: ) 009-017
    fileData += `${parameters.nfeCnpj.length === 11 ? 1 : 2}` // 5.0  Tipo de inscrição   1- CPF 2 CNPJ (tam: 1 ) 018-018
    fileData += `${parameters.nfeCnpj}`.padStart(14, '0') // 6.0 Número de inscrição da empresa  (tam: 15) 019-033
    fileData += ``.padStart(20, ' ') // 7.0 Convênio  (tam: 20) 033-052
    fileData += `${bankAccount.agency}`.padStart(5, '0') // 8.0 Agência (tam: 5) 053-057
    fileData += ``.padStart(1, ' ') // 9.0 Agência DV (tam: 1) 058-058
    fileData += `${bankAccount.number}`.padStart(12, '0') // 10.0 Número Conta (tam: 12) 059-070
    fileData += `${bankAccount.verifyingDigit}` // 11.0 DV da conta corrente  (tam: 1) 071-071
    fileData += ``.padStart(1, ' ') // 12.0 DV (tam: 1) 072-072
    fileData += `${parameters.nfeRazao.length > 30 ? parameters.nfeRazao.slice(0, 30) : parameters.nfeRazao}`.padEnd(
      30,
      ' ',
    ) // 13.0 Nome da empresa   (tam: 30) 073-102
    fileData += `SICREDI`.padEnd(30, ' ') // 14.0 Nome do Banco   (tam: 30 valor fixo: SICREDI) 103-132
    fileData += ''.padEnd(10, ' ') // 15.0  CNAB  (tam: 10 valor fixo: ) 133-142
    fileData += '1' // 16.0  Código 1 - Remessa (Empresa > Sicredi)  (tam: 1 valor fixo: 1) 143-143
    fileData += `${format(new Date(), 'ddMMyyyy')}` // 17.0  DATA de Geração  (tam: 8 ) 144-151
    fileData += `${format(new Date(), 'HHmmss')}` // 18.0  Hora de Geração  (tam: 6 ) 152-157
    fileData += `${bankAccount.sequenceLot}`.padStart(6, '0') // 19.0 Número sequencial do arquivo de remessa  (tam: 8) 158-163
    fileData += `081`.padStart(3, '0') // 20.0 Layout do Arquivo  (tam: 3 fixo: 081) 164-166
    fileData += `01600`.padStart(5, '0') // 21.0 Densidade  (tam: 5 fixo: 01600) 167-171
    fileData += ``.padStart(20, ' ') // 22.0 CNAB  (tam: 20 fixo: ) 172-191
    fileData += ``.padStart(20, ' ') // 23.0 CNAB  (tam: 20 fixo: ) 192-211
    fileData += ``.padStart(29, ' ') // 24.0 CNAB  (tam: 29 fixo: ) 212-240
    fileData += `\r\n`
    // Registro Header do Lote
    fileData += '748' // 1.1  Código do Banco Sicredi  (tam: 3 valor fixo: 748) 001-003
    fileData += '0001' // 2.1  Lote de Serviço  (tam: 4 valor fixo: 0001) 004-007
    fileData += '1' // 3.1 Tipo de registro  (tam: 1 valor fixo: 1) 008-008
    fileData += 'R' // 4.1 Tipo de Operação  (tam: 1 ) 009-009
    fileData += '01' // 5.1 Tipo de Serviço  (tam: 2 valor fixo: 02 ) 010-011
    fileData += ''.padEnd(2, ' ') // 6.1 CNAB (tam: 2 valor fixo:  ) 012-013
    fileData += '040' // 7.1 Layout do Lote (tam: 3 valor fixo:040  ) 014-016
    fileData += ''.padEnd(1, ' ') // 8.1 CNAB  (tam: 2 valor fixo:  ) 017-017
    fileData += `${parameters.nfeCnpj.length === 11 ? 1 : 2}` // 9.1 Tipo de inscrição da empresa 1- CPF 2 CNPJ (tam: 1) 018-018
    fileData += `${parameters.nfeCnpj}`.padStart(15, '0') // 10.1 Número de inscrição da empresa  (tam: 15) 019-033
    fileData += ``.padStart(20, ' ') // 11.1 Código do Convênio no banco  (tam: 20) 034-053
    fileData += `${bankAccount.agency}`.padStart(5, '0') // 12.1 Agência (tam: 20) 054-058
    fileData += ``.padStart(1, '0') // 13.1 Agência (tam: 1) 059-059
    fileData += `${bankAccount.number}`.padStart(12, '0') // 14.1 Número Conta (tam: 12) 060-071
    fileData += `${bankAccount.verifyingDigit}`.padStart(1, '0') // 15.1 DV da conta corrente  (tam: 1) 072-072
    fileData += ``.padStart(1, ' ') // 16.1 CNAB  (tam: 1) 073-073
    fileData += `${parameters.nfeRazao.length > 30 ? parameters.nfeRazao.slice(0, 30) : parameters.nfeRazao}`.padEnd(
      30,
      ' ',
    ) // 17.1 Nome da empresa   (tam: 30) 074-103
    fileData += ``.padStart(40, ' ') // 18.1 CNAB  (tam: 40) 104-143
    fileData += ``.padStart(40, ' ') // 19.1 Mensagem 2  (tam: 40) 144-183
    fileData += `${bankAccount.sequenceLot}`.padStart(8, '0') // 20.1 Número sequencial do arquivo de remessa  (tam: 8) 184-191
    fileData += `${format(new Date(), 'ddMMyyyy')}` // 21.1 Data de geração  (tam: 8) 192-199
    fileData += ``.padStart(8, '0') // 22.1 Data do Crédito  (tam: 8,  fixo: 00000000) 200-207
    fileData += ``.padStart(33, ' ') // 22.1 CNAB  (tam: 33  ) 208-240
    fileData += `\r\n`

    for (let i = 0; i < data.installments.length; i++) {
      const installment = data.installments[i]
      const inst = await this.installmentRepository.findById(installment.id)
      let customer = null
      if (parameters.nfeLagradouro) {
        customer = {
          cpfCnpj: inst.cpfCnpjApoio,
          name: inst.customerApoioName,
          address: inst.addressApoio,
          addressNumber: inst.addressNumberApoio,
          postalCode: inst.postalCodeApoio,
          cityId: Cities.find(city => city.id === inst.cityIdApoio).id,
          state: inst.stateApoio,
        }
      } else {
        customer = await this.customerRepository.findById(installment.customerId)
      }

      const dueDate = new Date(installment.dueDate)
      const newDueDate = new Date(dueDate)
      const dueDateFine = format(newDueDate.setDate(newDueDate.getDate() + 1), 'ddMMyyyy')

      // Registro Detalhe Segmento P
      fileData += '748' // 1.3P  Código do Banco Sicredi  (tam: 3 valor fixo: 748) 001-003
      fileData += '0001' // 2.3P  Lote  (tam: 4 valor fixo: 0001) 004-007
      fileData += '3' // 3.3P  Registro "3" - Detalhe  (tam: 1 valor fixo: 3) 008-009
      fileData += `${sequential}`.padStart(5, '0') // 4.3P  Nº do Registro  (tam: 5 ) 009-013
      fileData += `P` // 5.3P  Segmento (tam: 1, valor fixo: 5 ) 014-014
      fileData += ``.padStart(1, ' ') // 6.3P  CNAB (tam: 1, valor fixo:  ) 015-015
      fileData += `01` // 7.3P  Código de movimento  01 - Entrada de títulos (tam: 2,  ) 016-017
      fileData += `${bankAccount.agency}`.padStart(5, '0') // 8.3P Agência (tam: 20) 018-022
      fileData += ``.padStart(1, ' ') // 9.3P Agência (tam: 1) 023-023
      fileData += `${bankAccount.number}`.padStart(12, '0') // 10.3P Número Conta (tam: 12) 024-035
      fileData += `${bankAccount.verifyingDigit}` // 11.3P DV da conta corrente  (tam: 1) 036-036
      fileData += ``.padStart(1, ' ') // 12.3P DV da agência/Cooperativa  (tam: 1 valor fixo: ) 073-073
      fileData += `${installment.ourNumber}`.padEnd(20, ' ') // 13.3P Nosso Número  (tam: 20 ) 038-057
      fileData += `1` // 14.3P Carteira "1" - Cobrança Simples (tam: 20 valor fixo:1 ) 058-058
      fileData += `1` // 15.3P Cadastramento "1" - Cobrança com registro  (tam: 20 valor fixo:1) 059-059
      fileData += `1` // 16.3P Documento  (tam: 1 valor fixo:1) 060-060
      fileData += `2` // 17.3P Emissão Boleto 2 - Beneficiário emite (tam: 1 valor fixo:2) 061-061
      fileData += `2` // 18.3P Distribuição/Postagem Boleto  2 - Beneficiário distribui (tam: 1 valor fixo:2) 062-062
      fileData += `${installment.numeroDoc}${installment.numberInstallment}`.padStart(15, '0') // 19.3P Seu Número (Mandando o numeroDoc/numeroParcela) (tam: 15) 063-077
      fileData += `${format(dueDate, 'ddMMyyyy')}` // 20.3P Vencimento (tam: 8) 078-085
      fileData += `${parseFloat(installment.value).toFixed(2).replace('.', '')}`.padStart(15, '0') // 21.3P Valor (tam: 13) 086-100
      fileData += ``.padEnd(5, '0') // 22.3P Cooperativa / Ag. Cobradora (tam: 5 valor fixo: 00000) 101-105
      fileData += ``.padEnd(1, ' ') // 23.3P DV (tam: 1 valor fixo: ) 106-106
      fileData += `03` // 24.3P Espécie de Título 03 - DMI duplicata mercantil (tam: 2) 107-108
      fileData += `N` // 25.3P Aceite (tam: 1) 109-109
      fileData += `${format(new Date(installment.createdAt), 'ddMMyyyy')}` // 26.3P Data Emissão de emissão (tam: 8) 110-117
      fileData += `2` // 27.3P Código de Juros 2 - Percentual  (tam: 1) 118-118
      fileData += `${dueDateFine}` // 27.3P Data Juros (tam: 8) 119-126
      fileData += `${parseFloat(installment.interest).toFixed(2).replace('.', '')}`.padStart(15, '0') // 28.3P Juros  (tam: 13 ) 217-141
      fileData += `0` // 30.3P Código do desconto  0 - Sem desconto(tam: 1) 142-142
      fileData += ``.padEnd(8, '0') // 31.3P Data do desconto  (tam: 8 valor fixo: ) 143-150
      fileData += ``.padEnd(15, '0') // 32.3P Valor do desconto  (tam: 15 valor fixo: ) 151-165
      fileData += ``.padEnd(15, '0') // 33.3P Valor IOF  (tam: 15 ) 166-180
      fileData += ``.padEnd(15, '0') // 34.3P Valor abatimento  (tam: 15 ) 181-195
      fileData += `${installment.numeroDoc}${installment.numberInstallment}`.padEnd(25, ' ') // 35.3P Identificação do título na empresa (Mandando o numeroDoc/numeroParcela) (tam: 25) 196-220
      fileData += `3` // 36.3P Código para Protesto / Negativação automático 3 - Não protestar/Não negativar (tam: 1) 221-221
      fileData += `00` // 37.3PPrazo para Protesto / Negativação (tam: 2) 222-223
      fileData += `1` // 38.3P Código para Baixa/Devolução (tam: 1 fixo: 1) 224-224
      fileData += `000` // 39.3P Nº de dias para baixa/devolução (tam: 3 fixo: 000) 225-227
      fileData += `09` // 40.3P Código da Moeda (tam: 2 fixo: 09) 228-229
      fileData += `0000000000` // 41.3P Nº do contrato da operação de créd (tam: 10 fixo: 0000000000) 230-239
      fileData += ` ` // 41.3P Uso exclusivo Sicredi (tam: 10 fixo: 0000000000) 240-240
      fileData += `\r\n`
      // Registro Detalhe Segmento Q
      sequential += 1
      fileData += '748' // 1.3Q  Código do Banco Sicredi  (tam: 3 valor fixo: 748) 001-003
      fileData += '0001' // 2.3Q  Lote  (tam: 4 valor fixo: 0001) 004-007
      fileData += '3' // 3.3Q  Registro "3" - Detalhe  (tam: 1 valor fixo: 3) 008-009
      fileData += `${sequential}`.padStart(5, '0') // 4.3Q  Nº do Registro  (tam: 5 ) 009-013
      fileData += `Q` // 5.3Q  Segmento (tam: 1, valor fixo: 5 ) 014-014
      fileData += ``.padEnd(1, ' ') // 6.3Q Sem preenchimento (tam: 1 valor fixo: ) 015-015
      fileData += `01` // 7.3Q  Código de movimento da Remessa 01 - Entrada de títulos (tam: 1, valor fixo: 5 ) 016-017
      fileData += `${customer.cpfCnpj.length === 11 ? 1 : 2}` // 8.3Q Tipo de inscrição da empresa 1- CPF 2 CNPJ (tam: 1) 018-018
      fileData += `${customer.cpfCnpj}`.padStart(15, '0') // 9.3Q CPF/CNPJ(tam: 15) 019-033
      fileData += `${customer.name.length > 40 ? customer.name.slice(0, 40) : customer.name}`.padStart(40, ' ') // 10.3Q CPF/CNPJ(tam: 40) 033-073
      fileData += `${customer.address.length > 40 ? customer.address.slice(0, 40) : customer.address}, ${
        customer.addressNumber
      }`.padStart(40, ' ') // 11.3Q Endereço(tam: 40) 074-113
      fileData += ``.padStart(15, ' ') // 12.3Q Sem preenchimento (tam: 15) 114-128
      fileData += `${customer.postalCode}` // 13.3Q Endereço(tam: 8) 129-136
      fileData += `${customer.cityId}`.padEnd(15, ' ') // 15.3Q Cidade (tam: 15) 137-151
      fileData += `${customer.state}` // 16.3Q Estado (tam: 2) 152-153
      fileData += `0` // 17.3Q Tipo de pessoa 0 - Sem Beneficiário Final (tam: 1) 154-154
      fileData += ``.padEnd(15, '0') // 18.3Q CPF/CNPJ (tam: 15) 155-169
      fileData += ``.padEnd(40, ' ') // 19.3Q Nome (tam: 40) 170-209
      fileData += `000` // 20.3Q Cód. Banco Correspondente na Compensação (tam: 3 fixo: 000) 210-212
      fileData += ``.padEnd(20, ' ') // 21.3Q Nosso Nº no Banco Correspondente (tam: 20 fixo:  ) 213-232
      fileData += ``.padEnd(8, ' ') // 22.3Q CNAB (tam: 8 fixo: ) 233-240
      fileData += `\r\n`
      //  Registro Detalhe Segmento R
      sequential += 1
      fileData += '748' // 1.3R  Código do Banco Sicredi  (tam: 3 valor fixo: 748) 001-003
      fileData += '0001' // 2.3R  Lote  (tam: 4 valor fixo: 0001) 004-007
      fileData += '3' // 3.3R  Registro "3" - Detalhe  (tam: 1 valor fixo: 3) 008-009
      fileData += `${sequential}`.padStart(5, '0') // 4.3R  Nº do Registro  (tam: 5 ) 009-013
      fileData += `R` // 5.3R  Segmento (tam: 1, valor fixo: 5 ) 014-014
      fileData += ``.padEnd(1, ' ') // 6.3R Sem preenchimento (tam: 1 valor fixo: ) 015-015
      fileData += `01` // 7.3R  Código de movimento da Remessa 01 - Entrada de títulos (tam: 1, valor fixo: 5 ) 016-017
      fileData += `0` // 8.3R  Código do desconto 2 0 - Sem desconto  (tam: 1, valor fixo: 0 ) 018-018
      fileData += ``.padEnd(8, '0') // 9.3R Data desconto 2 (tam: 8,  ) 019-026
      fileData += ``.padEnd(15, '0') // 10.3R Valor do Desconto 2 (tam: 15,  ) 027-041
      fileData += `0` // 11.3R  Código do desconto 3 0 - Sem desconto  (tam: 1, valor fixo: 0 ) 042-042
      fileData += ``.padEnd(8, '0') // 12.3R Data desconto 3 (tam: 8,  ) 043-050
      fileData += ``.padEnd(15, '0') // 13.3R Valor do Desconto 3 (tam: 13,  ) 051-065
      fileData += `2` // 14.3R Código da Multa (tam: 13,  ) 066-066
      fileData += `${dueDateFine}` // 15.3R Data da Multa (tam: 8,  ) 067-074
      fileData += `${parseFloat(installment.fine).toFixed(2).replace('.', '')}`.padStart(15, '0') // 16.3R Multa (tam: 13,  ) 075-089
      fileData += ``.padStart(10, ' ') // 17.3R Informação do pagador (tam: 10, valor fixo:  ) 090-099
      fileData += ``.padStart(40, ' ') // 18.3R CNAB (tam: 40, valor fixo:  ) 100-139
      fileData += ``.padStart(40, ' ') // 19.3R CNAB (tam: 40, valor fixo:  ) 140-179
      fileData += ``.padStart(20, ' ') // 20.3R CNAB (tam: 40, valor fixo:  ) 180-199
      fileData += ``.padStart(8, '0') // 21.3R Cod. Ocor. Pagador  (tam: 8, valor fixo:0  ) 200-207
      fileData += ``.padStart(3, '0') // 22.3R Banco  (tam: 3, valor fixo:0  ) 208-210
      fileData += ``.padStart(5, '0') // 23.3R Agência  (tam: 5, valor fixo:0  ) 211-215
      fileData += `0` // 24.3R Agência  (tam: 1, valor fixo:0  ) 216-216
      fileData += ``.padStart(12, '0') // 25.3R Conta Corrente  (tam: 12, valor fixo:0  ) 217-228
      fileData += ` ` // 26.3R Agência  (tam: 1, valor fixo:  ) 229-229
      fileData += ` ` // 27.3R DV  (tam: 1, valor fixo:  ) 230-230
      fileData += `0` // 28.3R Ident. da Emissão do Aviso Déb.  (tam: 1, valor fixo: 0 ) 231-231
      fileData += ``.padEnd(9, ' ') // 29.3R CNAB  (tam: 1, valor fixo:  ) 232-240
      fileData += `\r\n`
      sequential += 1
    }

    // Registro Trailler do Lote
    fileData += '748' // 1.5  Código do Banco Sicredi  (tam: 3 valor fixo: 748) 001-003
    fileData += '0001' // 2.5  Lote  (tam: 4 valor fixo: 0001) 004-007
    fileData += '5' // 3.5  Registro "5" - Trailler lote   (tam: 1 valor fixo: 3) 008-009
    fileData += ''.padEnd(9, ' ') // 4.5   CNAB  (tam: 9 valor fixo: ) 008-017
    fileData += `${(fileData.match(/\r\n/g) || []).length}`.padStart(6, '0') // 5.5  Quantidade de Registros  (tam: 6 ) 018-023
    fileData += ``.padStart(6, '0') // 6.5  Quantidade de Registros  (tam: 6 ) 024-029
    fileData += ``.padStart(17, '0') // 7.5  Totalização da Cobrança Simples, será utilizado  apenas no arquivo de retorno  (tam: 17 ) 030-046
    fileData += ``.padStart(6, '0') // 8.5  Valor Total dos Títulos em  Carteiras  (tam: 6 ) 047-052
    fileData += ``.padStart(17, '0') // 9.5  Valor Total dos Títulos em  Carteiras  (tam: 17 ) 053-069
    fileData += ``.padStart(6, '0') // 10.5  Totalização da Cobrança Caucionada, será utilizado apenas no arquivo de retorno  (tam: 6 ) 070-075
    fileData += ``.padStart(17, '0') // 11.5  Totalização da Cobrança Caucionada, será utilizado apenas no arquivo de retorno  (tam: 7 ) 076-092
    fileData += ``.padStart(6, '0') // 12.5  Totalização da Cobrança Descontada, será utilizado apenas no arquivo de retorno  (tam: 6 ) 093-098
    fileData += ``.padStart(17, '0') // 13.5 Totalização da Cobrança Descontada, será utilizado apenas no arquivo de retorno  (tam: 17 ) 099-115
    fileData += ``.padStart(8, ' ') // 14.5 N. do Aviso (O Sicredi não utiliza esse campo)  (tam: 8 ) 116-123
    fileData += ``.padStart(117, ' ') // 15.5 CNAB  (tam: 117 ) 124-240
    fileData += `\r\n`
    sequential += 1
    // Registro Trailler do Arquivo
    fileData += '748' // 1.9  Código do Banco Sicredi  (tam: 3 valor fixo: 748) 001-003
    fileData += '9999' // 2.9 Lote  (tam: 4 valor fixo: 9999) 004-007
    fileData += '9' // 3.9  Registro "9" - Trailler arquivo   (tam: 1 valor fixo: 3) 008-009
    fileData += ''.padEnd(9, ' ') // 4.9  CNAB   (tam: 1 valor fixo: 9) 009-017
    fileData += '000001' // 5.9  Quantidade de Lotes   (tam: 1 valor fixo: 000001) 018-023
    fileData += `${(fileData.match(/\r\n/g) || []).length + 1}`.padStart(6, '0') // 6.9 Quantidade de Registros  (tam: 6 ) 024-029
    fileData += `000000` // 7.9 Quantidade de Contas Concil  (tam: 6  fixo: 000000) 030-035
    fileData += ' '.padStart(205, ' ') // 8.9 CNAB  (tam: 205 ) 036-240
    fileData += `\r\n`

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
