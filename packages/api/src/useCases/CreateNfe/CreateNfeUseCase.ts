import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
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
import { ICreateNfeDTO } from './CreateNfeDTO'

export class CreateNfeUseCase {
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
    private orderRepository: OrderRepository,
  ) {}

  validate(data: ICreateNfeDTO) {
    if (!data.cliente && data.orderId) {
      throw new ApiError('O Cliente é obrigatório.', 422)
    }
    if (!data.paymentMean && data.orderId) {
      throw new ApiError('Informe forma de pagamento', 422)
    }
    if (!data.products) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }
  }

  async execute(data: ICreateNfeDTO, prismaTransaction: PrismaTransaction) {
    await this.validate(data)
    let customer
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    if (parameter && parameter.getApoio) {
      customer = data.Customer
    } else {
      customer = await this.customerRepository.findById(data.cliente)
    }
    const auxLastNota = parameter?.ultNota ? parameter?.ultNota + 1 : 1
    data.numeroNota = data.numeroNota || auxLastNota
    data.serie = parameter?.serie ? parameter?.serie : 1
    try {
      const nfe = await this.nfeRepository.create(
        {
          numeroNota: data.numeroNota,
          serie: data.serie,
          naturezaOp: data.naturezaOp,
          razaoSocial: customer.name,
          orderId: data.orderId,
          paymentMethodId: null,
          propertyId: data.propertyId,
          customerApoioProperty: customer.customerApoioProperty,
          taxpayerType: customer.taxpayerType,
          documentType: customer.documentType,
          rgIe: customer.stateInscription,
          installments: data.installments || null,
          paymentMean: data.paymentMean || null,
          cpfCnpj: customer.cpfCnpj,
          email: customer.email,
          endereco: customer.address,
          numero: customer.addressNumber,
          tipo: data.tipo.toUpperCase(),
          transpNome: data.transpNome?.substring(0, 20),
          cidade:
            parameter?.getApoio && data.cliente
              ? customer.city
              : Cities?.find(city => city.id === customer.cityId)?.name,
          estado: customer.state,
          cep: customer.postalCode,
          fone: customer.phone,
          bairro: customer.province,
          data: new Date(),
          status: 'Envio Pendente',
          volumes: new Prisma.Decimal(data.products.length),
          especie: 'Vol',
          observacoes: data.observacoes || '',
          pesoBruto: new Prisma.Decimal(0),
          pesoLiquido: new Prisma.Decimal(0),
          frete: new Prisma.Decimal(data.frete),
          seguro: new Prisma.Decimal(data.seguro),
          outrasDespesas: new Prisma.Decimal(data.outrasDespesas),
          freteOutros: new Prisma.Decimal(data.freteOutros),
          desconto: new Prisma.Decimal(data.desconto),
          totalDinheiro: new Prisma.Decimal(data?.paymentMean === 5 ? data.totalNota ?? 0 : 0),
          totalBoleto: new Prisma.Decimal(
            data?.paymentMean === 1 || data?.paymentMean === 10 ? data.totalNota ?? 0 : 0,
          ),
          totalCartaoCredito: new Prisma.Decimal(data?.paymentMean === 7 ? data?.totalNota ?? 0 : 0),
          totalCartaoDebito: new Prisma.Decimal(data?.paymentMean === 8 ? data?.totalNota ?? 0 : 0),
          totalCheque: new Prisma.Decimal(0),
          totalOutros: data.paymentMean
            ? new Prisma.Decimal(!(data.paymentMean in [1, 5, 7, 8]) ? data.totalNota ?? 0 : 0)
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
          dataSaida: new Date(),
          dataOrigem: new Date(),
          dataAutorizacao: new Date(),
          tipoFrete: 0,
          sequencia: 0,
          estorno: false,
          complementar: false,
          impressa: false,
          dataImpressao: new Date(),
          emailEnviado: false,
          processado: false,
          dDi: new Date(),
          cliente: data.cliente,
          companyId: data.companyId,
        },
        prismaTransaction,
      )
      await Promise.all(
        data.products.map(async reg => {
          if (reg && reg.id) {
            const prod = await this.productRepository.findById(reg.id)
            if (prod) {
              const St = await this.productTaxRepository.findByUf(prod.id, customer.state)
              if (St && data.orderId) {
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
                    stNfe: null,
                    producttax: null,
                    baseICMS: St.baseIcms,
                    valorICMS: St.baseIcmsSt,
                    aliquotaICMS: new Prisma.Decimal(St.simplesNacional ? 0 : St.aliquotaIcms ?? 0),
                    st: St.cst || 0,
                    cfop: St.cfop || '',
                    companyId: data.companyId,
                    unidade: prod.und,
                    cstPis: St.cstPis || null,
                    alqPis: new Prisma.Decimal(St.alqPis || 0),
                    cstCofins: St.cstCofins || null,
                    alqCofins: new Prisma.Decimal(St.alqCofins || 0),
                    pisCofins: false,
                    cf: prod.cf,
                    ipi: new Prisma.Decimal(St.ipi || 0),
                    uf: St.uf || '',
                    valorBaseIcms: new Prisma.Decimal(0),
                    valorBaseIcmsSt: new Prisma.Decimal(0),
                  },
                  prismaTransaction,
                )
              } else {
                if (prod) {
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
                      baseICMS: new Prisma.Decimal(0),
                      baseIcmsSt: new Prisma.Decimal(0),
                      valorICMS: new Prisma.Decimal(0),
                      valorIcmsSt: new Prisma.Decimal(0),
                      aliquotaICMS: reg.aliquotaICMS,
                      aliquotaIcmsSt: reg.aliquotaIcmsSt,
                      st: reg?.st || 0,
                      stNfe: null,
                      cfop: reg?.cfop || '',
                      companyId: data.companyId,
                      unidade: prod.und,
                      cstPis: reg.cstPis,
                      alqPis: reg.alqPis,
                      cstCofins: reg.cstCofins,
                      alqCofins: reg.alqCofins,
                      pisCofins: false,
                      cf: prod.cf || 0,
                      ipi: reg.ipi,
                      uf: reg?.uf || '',
                      mva: reg.mva,
                      valorBaseIcms: new Prisma.Decimal(0),
                      valorBaseIcmsSt: new Prisma.Decimal(0),
                    },
                    prismaTransaction,
                  )
                }
              }
              if (prod) {
                await this.productRepository.update(
                  prod.id,
                  {
                    stock: prod.stock.sub(reg.quantidade ?? 0),
                  },
                  prismaTransaction,
                )
                await this.stockProductsRepository.create(
                  {
                    productId: prod.id,
                    amount: new Prisma.Decimal(reg?.quantidade ?? 0),
                    type: 'S',
                    generateId: nfe.id,
                    numeroDoc: '' + nfe.numeroNota,
                    number: nfe.serie,
                    typeGenerate: 2,
                    employeeId: data.employeeId,
                    companyId: data.companyId,
                    createdAt: nfe.data,
                  },
                  prismaTransaction,
                )
              }
            }
          }
        }),
      )
      if (parameter)
        await this.parameterRepository.update(
          parameter?.id,
          { ...parameter, ultNota: nfe.numeroNota },
          prismaTransaction,
        )
      if (data.orderId) await this.orderRepository.update(data.orderId, { status: 1 }, prismaTransaction)
      const auxinstallments = createInstallmentsNfe(nfe, data.companyId, parameter, customer)

      if (auxinstallments) {
        await Promise.all(
          auxinstallments.map(async installment => {
            if (data.paymentMean === 1) {
              const BankAccount = await this.bankAccountRepository.findById(data.bankAccountId)
              if (BankAccount) {
                BankAccount.ourNumber = BankAccount.ourNumber || 0 + 1
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
                          boleto.beneficiario.dadosBancarios.nossoNumero.toString() +
                          boleto.beneficiario.dadosBancarios.nossoNumeroDigito,
                        digitableLine: novoBoleto?.boletoInfo?.getLinhaDigitavelFormatado().linha,
                        wallet: data.wallet,
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
                        null,
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
                        wallet: data.wallet,
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
              }
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
      console.log(err)
    }
  }
}
