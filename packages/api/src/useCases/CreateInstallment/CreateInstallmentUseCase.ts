import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { bankSlipSicredi, bankSlipBradesco } from '../../utils/gerar-boletos/boleto'
import { Bancos, Boletos } from '../../utils/gerar-boletos/lib/index'
import { createInstallmentsSingle } from '../../utils/Installments/installments'
import GeradorDeDigitoPadrao from './../../utils/gerar-boletos/lib/boleto/gerador-de-digito-padrao'
import { ICreateInstallmentDTO } from './CreateInstallmentDTO'
export class CreateInstallmentUseCase {
  constructor(
    private installmentRepository: InstallmentRepository,
    private bankAccountRepository: BankAccountRepository,
    private parameterRepository: ParameterRepository,
    private customerRepository: CustomerRepository,
  ) {}

  validate(data: ICreateInstallmentDTO) {
    if (!data.numberInstallment) {
      throw new ApiError('O Numero da parcela é obrigatório.', 422)
    }
    if (!data.customerId && !data.Customer) {
      throw new ApiError('Cliente é obrigatório.', 422)
    }
    if (!data.dueDate) {
      throw new ApiError('Vencimento é obrigatório.', 422)
    }
    if (data.value <= 0) {
      throw new ApiError('Informe um valor valido.', 422)
    }
    if (data.bankSlip && !data.bankAccountId) {
      throw new ApiError('Informe uma conta.', 422)
    }
  }

  async execute(data: ICreateInstallmentDTO, prismaTransaction: PrismaTransaction) {
    await this.validate(data)
    let customer
    const parameter = await this.parameterRepository.getParameter(data.companyId ?? '')
    if (parameter && parameter.getApoio) {
      customer = data.Customer
    } else {
      customer = await this.customerRepository.findById(data.customerId ?? '')
    }
    let account
    if (data && data.subAccounts.length === 0) {
      account.push({ ...data })
    }
    const installments = createInstallmentsSingle(
      data.subAccounts.length > 0 ? data.subAccounts : account,
      data.numeroDoc,
      data.companyId,
      parameter,
      customer,
    )
    await Promise.all(
      installments.map(async installment => {
        if (installment) {
          if (data.bankSlip && data.bankAccountId) {
            const banckAccount = await this.bankAccountRepository.findById(data.bankAccountId)
            if (banckAccount && banckAccount.ourNumber) {
              banckAccount.ourNumber += 1
              const nossoNumero =
                `0${banckAccount.agency}2434269${new Date().getFullYear().toString().slice(2)}2` +
                banckAccount.ourNumber.toString().padStart(5, '0')
              if (banckAccount.institution === 748) {
                const boleto = bankSlipSicredi(
                  Bancos,
                  customer,
                  parameter,
                  banckAccount,
                  GeradorDeDigitoPadrao,
                  nossoNumero,
                  installment,
                )
                if (boleto) {
                  const novoBoleto = new Boletos(boleto)
                  if (novoBoleto) {
                    novoBoleto.gerarBoleto()
                    const stream = novoBoleto.pdfFile()

                    const buffers = []
                    const i = await this.installmentRepository.create(
                      {
                        ...installment,
                        ourNumber:
                          `${new Date().getFullYear().toString().slice(2)}2` +
                          boleto.beneficiario.dadosBancarios.nossoNumero +
                          boleto.beneficiario.dadosBancarios.nossoNumeroDigito,
                        digitableLine: novoBoleto?.boletoInfo?.getLinhaDigitavelFormatado().linha,
                        wallet: banckAccount.wallet,
                        bankAccountId: data.bankAccountId,
                        bankSlip: true,
                        fine: new Prisma.Decimal(parameter?.fine || 0),
                        interest: new Prisma.Decimal(parameter?.interest || 0),
                      },
                      prismaTransaction,
                    )
                    stream.on('data', buffers.push.bind(buffers))
                    stream.on('end', async () => {
                      const buffer = Buffer.concat(buffers)
                      await this.installmentRepository.createBankSpliStorage(
                        {
                          installmentId: i.id,
                          companyId: i.companyId,
                          conteudo: buffer,
                        },
                        prismaTransaction,
                      )
                    })
                  }
                }
              } else if (banckAccount.institution === 237) {
                const boleto = bankSlipBradesco(
                  Bancos,
                  customer,
                  parameter,
                  banckAccount,
                  GeradorDeDigitoPadrao,
                  banckAccount.ourNumber,
                  installment,
                )
                const novoBoleto = new Boletos(boleto)
                if (novoBoleto) {
                  novoBoleto.gerarBoleto()
                  const stream = novoBoleto.pdfFile()

                  const buffers = []

                  const i = await this.installmentRepository.create(
                    {
                      ...installment,
                      ourNumber:
                        boleto.beneficiario.dadosBancarios.nossoNumero.toString() +
                        boleto.beneficiario.dadosBancarios.nossoNumeroDigito,
                      digitableLine: novoBoleto?.boletoInfo?.getLinhaDigitavelFormatado().linha,
                      wallet: banckAccount.wallet,
                      bankAccountId: data.bankAccountId,
                      bankSlip: true,
                    },
                    prismaTransaction,
                  )
                  stream.on('data', buffers.push.bind(buffers))
                  if (buffers) {
                    stream.on('end', async () => {
                      const buffer = Buffer.concat(buffers)
                      await this.installmentRepository.createBankSpliStorage(
                        {
                          installmentId: i.id,
                          companyId: i.companyId,
                          conteudo: buffer,
                        },
                        prismaTransaction,
                      )
                    })
                  }
                }
              }

              await this.bankAccountRepository.update(banckAccount.id, banckAccount, prismaTransaction)
            }
          } else {
            if (installment) {
              await this.installmentRepository.create(
                {
                  ...installment,
                  ourNumber: '',
                  digitableLine: '',
                  bankAccountId: data.bankAccountId,
                  bankSlip: data.bankSlip,
                },
                prismaTransaction,
              )
            }
          }
        }
      }),
    )
  }
}
