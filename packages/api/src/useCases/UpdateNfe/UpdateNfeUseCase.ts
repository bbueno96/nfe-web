import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { ApiError } from '../../utils/ApiError'
import { Cities } from '../../utils/constants'
import { bankSlipSicredi, bankSlipBradesco } from '../../utils/gerar-boletos/boleto'
import { Bancos, Boletos } from '../../utils/gerar-boletos/lib/index'
import { createInstallmentsNfe } from '../../utils/Installments/installments'
import GeradorDeDigitoPadrao from './../../utils/gerar-boletos/lib/boleto/gerador-de-digito-padrao'
import { IUpdateNfeDTO } from './UpdateNfeDTO'

export class UpdateNfeUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private nfeProductsRepository: NfeProductsRepository,
    private productTaxRepository: ProductTaxRepository,
    private parameterRepository: ParameterRepository,
    private installmentRepository: InstallmentRepository,
    private payMethodsRepository: PayMethodsRepository,
    private bankAccountRepository: BankAccountRepository,
    private stockProductsRepository: StockProductsRepository,
  ) {}

  validate(data: IUpdateNfeDTO) {
    if (!data.cliente && data.orderId) {
      throw new ApiError('O Cliente é obrigatório.', 422)
    }
    if (!data.paymentMean && data.orderId) {
      throw new ApiError('Informe ao menos um meio de pagamento.', 422)
    }
    if (!data.products) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }
  }

  async execute(data: IUpdateNfeDTO, prismaTransaction: PrismaTransaction) {
    if (data.id) {
      await this.validate(data)
      const oldData = await this.nfeRepository.findByIdP(data.id)
      if (!oldData) {
        throw new ApiError('Nota não encontrada.', 404)
      }
      if (oldData.status === 'Cancelado') {
        throw new ApiError('Nota não pode ser altarada pois esta Cancelada.', 201)
      } else if (oldData.status === 'Autorizado') {
        throw new ApiError('Nota não pode ser altarada pois esta Autorizada.', 201)
      }

      let customer
      let nfe
      const parameter = await this.parameterRepository.getParameter(data.companyId)
      if (parameter?.getApoio) {
        if (!data.Customer?.cpfCnpj) {
          customer = {
            cliente: oldData.cliente,
            name: oldData.razaoSocial,
            stateInscription: oldData.rgIe,
            mobilePhone: oldData.fone,
            address: oldData.endereco,
            addressNumber: oldData.numero,
            complement: '',
            province: oldData.bairro,
            postalCode: oldData.cep,
            cityId: oldData.cidade,
            state: oldData.estado,
            cpfCnpj: oldData.cpfCnpj,
          }
        } else {
          customer = data.Customer
        }
      } else {
        customer = await this.customerRepository.findById(data.cliente)
      }
      try {
        if (!data.Customer?.cpfCnpj) {
          nfe = await this.nfeRepository.update(
            oldData.id,
            {
              razaoSocial: oldData.razaoSocial,
              rgIe: oldData.rgIe,
              email: oldData.email,
              cpfCnpj: oldData.cpfCnpj,
              endereco: oldData.endereco,
              numero: oldData.numero,
              cidade: oldData.cidade,
              estado: oldData.estado,
              cep: oldData.cep,
              fone: oldData.fone,
              bairro: oldData.bairro,
              data: new Date(),
              status: oldData.status,
              volumes: new Prisma.Decimal(data.volumes || 1),
              especie: data.especie,
              tipo: data.tipo.toUpperCase(),
              pesoBruto: new Prisma.Decimal(0),
              pesoLiquido: new Prisma.Decimal(0),
              frete: new Prisma.Decimal(data.frete),
              seguro: new Prisma.Decimal(data.seguro),
              outrasDespesas: new Prisma.Decimal(data.outrasDespesas),
              freteOutros: new Prisma.Decimal(data.freteOutros),
              desconto: new Prisma.Decimal(data.desconto),
              totalDinheiro: new Prisma.Decimal(data.paymentMean === 5 ? data.totalNota || 0 : 0),
              totalBoleto: new Prisma.Decimal(
                data.paymentMean === 1 || data.paymentMean === 10 ? data.totalNota || 0 : 0,
              ),
              totalCartaoCredito: new Prisma.Decimal(data.paymentMean === 7 ? data.totalNota || 0 : 0),
              totalCartaoDebito: new Prisma.Decimal(data.paymentMean === 8 ? data.totalNota || 0 : 0),
              totalCheque: new Prisma.Decimal(0),
              totalOutros: data.paymentMean
                ? new Prisma.Decimal(!(data.paymentMean in [1, 5, 7, 8]) ? data.totalNota || 0 : 0)
                : new Prisma.Decimal(0),
              totalNota: new Prisma.Decimal(data.totalNota || 0),
              totalProduto: new Prisma.Decimal(
                data.products.reduce((acc, curr) => acc.add(curr.total || 0), new Prisma.Decimal(0)),
              ),
              qtdePagina: 0,
              qtdeItens: 0,
              qtdeProdutos: 0,
              baseICMS: new Prisma.Decimal(0),
              valorICMS: new Prisma.Decimal(0),
              valorTributo: new Prisma.Decimal(0),
              dataSaida: oldData.dataSaida,
              dataOrigem: oldData.dataOrigem,
              dataAutorizacao: undefined,
              tipoFrete: data.tipoFrete,
              sequencia: 0,
              observacoes: data.observacoes,
              placaTransp: data.placaTransp,
              ufTransp: data.ufTransp,
              rntrcTransp: data.rntrcTransp,
            },
            prismaTransaction,
          )
        } else {
          nfe = await this.nfeRepository.update(
            oldData.id,
            {
              razaoSocial: customer.name,
              naturezaOp: data.naturezaOp,
              nfeRef: data.nfeRef,
              customerApoioProperty: customer.customerApoioProperty,
              taxpayerType: customer.taxpayerType,
              documentType: customer.documentType,
              email: customer.email,
              rgIe: customer.stateInscription,
              cpfCnpj: customer.cpfCnpj,
              endereco: customer.address,
              numero: customer.addressNumber,
              cidade:
                parameter?.getApoio && data.cliente
                  ? customer.city
                  : Cities.find(city => city.id === customer.cityId)?.name,
              estado: customer.state,
              cep: customer.postalCode,
              fone: customer.phone,
              bairro: customer.province,
              data: new Date(),
              status: 'Envio Pendente',
              tipo: data.tipo.toUpperCase(),
              volumes: new Prisma.Decimal(data.volumes || 1),
              especie: data.especie,
              pesoBruto: new Prisma.Decimal(data.pesoBruto || 0),
              pesoLiquido: new Prisma.Decimal(data.pesoLiquido || 0),
              frete: new Prisma.Decimal(data.frete),
              seguro: new Prisma.Decimal(data.seguro),
              outrasDespesas: new Prisma.Decimal(data.outrasDespesas),
              freteOutros: new Prisma.Decimal(data.freteOutros),
              desconto: new Prisma.Decimal(data.desconto),
              totalDinheiro: new Prisma.Decimal(data.paymentMean === 5 ? data.totalNota || 0 : 0),
              totalBoleto: new Prisma.Decimal(
                data.paymentMean === 1 || data.paymentMean === 10 ? data.totalNota || 0 : 0,
              ),
              totalCartaoCredito: new Prisma.Decimal(data.paymentMean === 7 ? data.totalNota || 0 : 0),
              totalCartaoDebito: new Prisma.Decimal(data.paymentMean === 8 ? data.totalNota || 0 : 0),
              totalCheque: new Prisma.Decimal(0),
              totalOutros: data.paymentMean
                ? new Prisma.Decimal(!(data.paymentMean in [1, 5, 7, 8]) ? data.totalNota || 0 : 0)
                : new Prisma.Decimal(0),
              totalNota: new Prisma.Decimal(data.totalNota || 0),
              totalProduto: new Prisma.Decimal(
                data.products.reduce((acc, curr) => acc.add(curr.total || 0), new Prisma.Decimal(0)),
              ),
              qtdePagina: 0,
              qtdeItens: 0,
              qtdeProdutos: data.products.length,
              baseICMS: new Prisma.Decimal(0),
              valorICMS: new Prisma.Decimal(0),
              valorTributo: new Prisma.Decimal(0),
              dataSaida: oldData.dataSaida,
              dataOrigem: oldData.dataOrigem,
              dataAutorizacao: undefined,
              tipoFrete: data.tipoFrete,
              sequencia: 0,
              observacoes: data.observacoes,
            },
            prismaTransaction,
          )
        }
        await this.nfeProductsRepository.remove(oldData.id, prismaTransaction)
        await Promise.all(
          data.products.map(async reg => {
            if (reg.id || reg.produto) {
              const prod = await this.productRepository.findById(reg.produto || reg.id || '')
              if (prod) {
                const auxBaseIcmsSt = new Prisma.Decimal(
                  reg.baseIcmsSt ? (reg.baseIcmsSt === new Prisma.Decimal(0) ? 100 : reg.baseIcmsSt) : 100,
                )
                const auxBaseICMS = new Prisma.Decimal(
                  reg.baseICMS ? (reg.baseICMS === new Prisma.Decimal(0) ? 100 : reg.baseICMS) : 100,
                )
                const auxTotal = new Prisma.Decimal(reg.total || 0)
                await this.nfeProductsRepository.create(
                  {
                    nota: nfe.id,
                    produto: prod.id,
                    cod: prod.cod,
                    descricao: prod.description,
                    ncm: prod.ncm,
                    quantidade: reg.quantidade,
                    unitario: reg.unitario,
                    total: reg.total,
                    producttax: null,
                    baseICMS: new Prisma.Decimal(
                      reg.baseICMS ? (reg.baseICMS === new Prisma.Decimal(0) ? 100 : reg.baseICMS) : 100,
                    ),
                    baseIcmsSt: new Prisma.Decimal(
                      reg.baseIcmsSt ? (reg.baseIcmsSt === new Prisma.Decimal(0) ? 100 : reg.baseIcmsSt) : 100,
                    ),
                    valorICMS: new Prisma.Decimal(
                      reg.aliquotaICMS && reg.total ? auxTotal.times(reg.aliquotaICMS).div(100) : 0,
                    ),
                    valorIcmsSt: new Prisma.Decimal(
                      reg.aliquotaIcmsSt && reg.total ? auxTotal.times(reg.aliquotaIcmsSt).div(100) : 0,
                    ),
                    aliquotaICMS: reg.aliquotaICMS,
                    aliquotaIcmsSt: reg.aliquotaIcmsSt,
                    st: reg.st || 0,
                    stNfe: null,
                    cfop: reg.cfop || '5102',
                    companyId: data.companyId,
                    unidade: prod.und,
                    cstPis: reg?.cstPis?.toString() || null,
                    alqPis: reg.alqPis,
                    cstCofins: reg?.cstCofins?.toString() || null,
                    alqCofins: reg.alqCofins,
                    pisCofins: false,
                    cf: prod.cf || 0,
                    ipi: reg.ipi || 0,
                    uf: reg.uf,
                    mva: reg.mva,
                    valorBaseIcms: new Prisma.Decimal(
                      reg.total && auxBaseICMS ? auxBaseICMS.times(reg.total).div(100) : 0,
                    ),
                    valorBaseIcmsSt: new Prisma.Decimal(
                      reg.total && auxBaseIcmsSt ? auxBaseIcmsSt.times(reg.total).div(100) : 0,
                    ),
                  },
                  prismaTransaction,
                )
              }
            }
          }),
        )
        const installments = await this.installmentRepository.findByNfe(nfe.id)
        const auxInstallments = installments[0]
        if (installments.length) {
          let BankAccount
          if (auxInstallments.bankAccountId)
            BankAccount = await this.bankAccountRepository.findById(auxInstallments.bankAccountId)
          await this.installmentRepository.removeByNfe(nfe.id, prismaTransaction)
          const installments = createInstallmentsNfe(nfe, data.companyId, parameter, customer)

          await Promise.all(
            installments.map(async installment => {
              if (data.paymentMean === 1) {
                BankAccount.ourNumber += 1
                const nossoNumero =
                  `0${BankAccount.agency}2434269${new Date().getFullYear().toString().slice(2)}2` +
                  BankAccount.ourNumber.toString().padStart(5, '0')
                if (BankAccount.institution === 748) {
                  const boleto = bankSlipSicredi(
                    Bancos,
                    customer,
                    parameter,
                    BankAccount,
                    GeradorDeDigitoPadrao,
                    nossoNumero,
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
                          `${new Date().getFullYear().toString().slice(2)}2` +
                          boleto.beneficiario.dadosBancarios.nossoNumero +
                          boleto.beneficiario.dadosBancarios.nossoNumeroDigito,
                        digitableLine: novoBoleto?.boletoInfo?.getLinhaDigitavelFormatado().linha,
                        wallet: nfe.wallet,
                        bankAccountId: BankAccount.id,
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
                          nfeId: nfe.id,
                        },
                        prismaTransaction,
                      )
                    })
                  }
                } else if (BankAccount.institution === 237) {
                  const boleto = bankSlipBradesco(
                    Bancos,
                    customer,
                    parameter,
                    BankAccount,
                    GeradorDeDigitoPadrao,
                    BankAccount.ourNumber,
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
                        wallet: nfe.wallet,
                        bankAccountId: BankAccount.id,
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
                          nfeId: nfe.id,
                        },
                        prismaTransaction,
                      )
                    })
                  }
                }

                await this.bankAccountRepository.update(BankAccount.id, BankAccount, prismaTransaction)
              } else {
                await this.installmentRepository.create(
                  {
                    ...installment,
                    ourNumber: '',
                    digitableLine: '',
                  },
                  prismaTransaction,
                )
              }
            }),
          )
        }
        return nfe.id
      } catch (err) {
        throw new ApiError(`Erro Ao Processsar os dados: ${err}`, 500)
      }
    }
  }
}
