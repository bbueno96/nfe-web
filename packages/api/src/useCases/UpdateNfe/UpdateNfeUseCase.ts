import { Prisma } from '@prisma/client'

import { Nfe } from '../../entities/Nfe'
import { NfeProducts } from '../../entities/NfeProducts'
import { StockProducts } from '../../entities/StockProducts'
import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ApiError } from '../../utils/ApiError'
import { Cities } from '../../utils/constants'
import { bankSlipSicredi, bankSlipBrasil, bankSlipBradesco } from '../../utils/gerar-boletos/boleto'
import { Bancos, Boletos } from '../../utils/gerar-boletos/lib/index'
import { createInstallmentsNfe } from '../../utils/Installments/installments'
import { validationNfe } from '../../utils/nfe/validation'
import GeradorDeDigitoPadrao from './../../utils/gerar-boletos/lib/boleto/gerador-de-digito-padrao'
import { IUpdateNfeDTO } from './UpdateNfeDTO'

export class UpdateNfeUseCase {
  constructor(
    private nfeRepository: NfeRepository,
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private nfeProductsRepository: NfeProductsRepository,
    private taxSituationsRepository: TaxSituationsRepository,
    private parameterRepository: ParameterRepository,
    private installmentRepository: InstallmentRepository,
    private payMethodsRepository: PayMethodsRepository,
    private bankAccountRepository: BankAccountRepository,
    private stockProductsRepository: StockProductsRepository,
  ) {}

  validate(data: IUpdateNfeDTO) {
    if (!data.cliente) {
      throw new ApiError('O Cliente é obrigatório.', 422)
    }
    if (!data.paymentMethodId) {
      throw new ApiError('Informe ao menos uma forma de pagamento.', 422)
    }
    if (!data.products) {
      throw new ApiError('Informe ao menos um produto.', 422)
    }
  }

  async execute(data: IUpdateNfeDTO) {
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
    let nfe = null
    const parameter = await this.parameterRepository.getParameter(data.companyId)
    if (parameter.getApoio) {
      if (!data.Customer.cpfCnpj) {
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
      if (!data.Customer.cpfCnpj) {
        nfe = await this.nfeRepository.update({
          ...oldData,
          razaoSocial: oldData.razaoSocial,
          rgIe: oldData.rgIe,
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
          volumes: new Prisma.Decimal(data.products.length),
          especie: 'Vol',
          pesoBruto: data.products.reduce(
            (acc, curr) => acc + parseFloat(curr.peso || curr.weight * curr.quantidade),
            0,
          ),
          pesoLiquido: data.products.reduce(
            (acc, curr) => acc + parseFloat(curr.peso || curr.weight * curr.quantidade),
            0,
          ),
          frete: new Prisma.Decimal(data.frete),
          seguro: new Prisma.Decimal(data.seguro),
          outrasDespesas: new Prisma.Decimal(data.outrasDespesas),
          freteOutros: new Prisma.Decimal(data.freteOutros),
          desconto: new Prisma.Decimal(data.desconto),
          totalDinheiro: new Prisma.Decimal(data.totalNota),
          totalBoleto: new Prisma.Decimal(0),
          totalCartaoCredito: new Prisma.Decimal(0),
          totalCartaoDebito: new Prisma.Decimal(0),
          totalCheque: new Prisma.Decimal(0),
          totalOutros: new Prisma.Decimal(0),
          totalNota: new Prisma.Decimal(data.totalNota),
          totalProduto: new Prisma.Decimal(data.products.reduce((acc, curr) => acc + parseFloat(curr.total), 0)),
          qtdePagina: 0,
          qtdeItens: 0,
          qtdeProdutos: 0,
          baseICMS: new Prisma.Decimal(0),
          valorICMS: new Prisma.Decimal(0),
          valorTributo: new Prisma.Decimal(0),
          dataSaida: oldData.dataSaida,
          dataOrigem: oldData.dataOrigem,
          dataAutorizacao: undefined,
          tipoFrete: null,
          sequencia: 0,
          observacoes: data.observacoes,
        })
      } else {
        nfe = await this.nfeRepository.update({
          ...oldData,
          razaoSocial: customer.name,
          rgIe: customer.stateInscription,
          cpfCnpj: customer.cpfCnpj,
          endereco: customer.address,
          numero: customer.addressNumber,
          cidade: parameter.getApoio ? customer.city : Cities.find(city => city.id === customer.cityId).name,
          estado: customer.state,
          cep: customer.postalCode,
          fone: customer.phone,
          bairro: customer.province,
          data: new Date(),
          status: 'Envio Pendente',
          volumes: new Prisma.Decimal(data.products.length),
          especie: 'Vol',
          pesoBruto: data.products.reduce(
            (acc, curr) => acc + parseFloat(curr.peso || curr.weight * curr.quantidade),
            0,
          ),
          pesoLiquido: data.products.reduce(
            (acc, curr) => acc + parseFloat(curr.peso || curr.weight * curr.quantidade),
            0,
          ),
          frete: new Prisma.Decimal(data.frete),
          seguro: new Prisma.Decimal(data.seguro),
          outrasDespesas: new Prisma.Decimal(data.outrasDespesas),
          freteOutros: new Prisma.Decimal(data.freteOutros),
          desconto: new Prisma.Decimal(data.desconto),
          totalDinheiro: new Prisma.Decimal(data.totalNota),
          totalBoleto: new Prisma.Decimal(0),
          totalCartaoCredito: new Prisma.Decimal(0),
          totalCartaoDebito: new Prisma.Decimal(0),
          totalCheque: new Prisma.Decimal(0),
          totalOutros: new Prisma.Decimal(0),
          totalNota: new Prisma.Decimal(data.totalNota),
          totalProduto: new Prisma.Decimal(data.products.reduce((acc, curr) => acc + parseFloat(curr.total), 0)),
          qtdePagina: 0,
          qtdeItens: 0,
          qtdeProdutos: 0,
          baseICMS: new Prisma.Decimal(0),
          valorICMS: new Prisma.Decimal(0),
          valorTributo: new Prisma.Decimal(0),
          dataSaida: oldData.dataSaida,
          dataOrigem: oldData.dataOrigem,
          dataAutorizacao: undefined,
          tipoFrete: null,
          sequencia: 0,
          observacoes: data.observacoes,
        })
      }

      data.products.forEach(async Product => {
        const prod = await this.productRepository.findById(Product.produto || Product.id)
        const St = await this.taxSituationsRepository.findById(prod.st)
        await this.nfeProductsRepository.remove(prod.id)
        await this.productRepository.update({
          ...prod,
          stock: new Prisma.Decimal(parseFloat('' + prod.stock) + parseFloat(Product.quantidade)),
        })
        await this.stockProductsRepository.create(
          StockProducts.create({
            productId: prod.id,
            amount: Product.quantidade,
            type: 'E',
            generateId: nfe.id,
            numeroDoc: '' + nfe.numeroNota,
            number: nfe.serie,
            typeGenerate: 1,
            employeeId: data.employeeId,
            companyId: data.companyId,
            createdAt: nfe.data,
          }),
        )

        await this.nfeProductsRepository.create(
          NfeProducts.create({
            nota: nfe.id,
            produto: prod.id,
            cod: prod.cod,
            descricao: prod.description,
            ncm: prod.ncm,
            quantidade: new Prisma.Decimal(Product.quantidade),
            unitario: new Prisma.Decimal(Product.unitario),
            total: new Prisma.Decimal(Product.total),
            stNfe: prod.st,
            baseICMS: new Prisma.Decimal(0),
            valorICMS: new Prisma.Decimal(0),
            aliquotaICMS: new Prisma.Decimal(St.simplesNacional ? 0 : St.aliquotaIcms),
            st: St.cst,
            cfop: Product.cfop,
            companyId: data.companyId,
            unidade: prod.und,
            cstPis: prod.cstPis,
            alqPis: new Prisma.Decimal(prod.alqPis || 0),
            cstCofins: prod.cstCofins,
            alqCofins: new Prisma.Decimal(prod.alqCofins || 0),
            pisCofins: prod.pisCofins,
            cf: prod.cf,
          }),
        )

        await this.productRepository.update({
          ...prod,
          stock: new Prisma.Decimal(parseFloat('' + prod.stock) - parseFloat(Product.quantidade)),
        })
        await this.stockProductsRepository.create(
          StockProducts.create({
            productId: prod.id,
            amount: Product.quantidade,
            type: 'S',
            generateId: nfe.id,
            numeroDoc: '' + nfe.numeroNota,
            number: nfe.serie,
            typeGenerate: 2,
            employeeId: data.employeeId,
            companyId: data.companyId,
            createdAt: nfe.data,
          }),
        )
      })
      const paymentMethod = await this.payMethodsRepository.findById(nfe.paymentMethodId)
      const { BankAccount } = paymentMethod

      const installments = await this.installmentRepository.findByNfe(nfe.id)
      if (installments.length) {
        await this.installmentRepository.removeByNfe(nfe.id)
        if (paymentMethod.generateInstallmens) {
          const installments = createInstallmentsNfe(paymentMethod, nfe, data.companyId, parameter, customer)

          installments.forEach(async installment => {
            if (paymentMethod.bankSlip) {
              BankAccount.ourNumber += 1
              const nossoNumero =
                `0${BankAccount.agency}2434269${new Date().getFullYear().toString().slice(2)}2` +
                BankAccount.ourNumber.toString().padStart(5, '0')
              let boleto = null
              if (BankAccount.institution === 748) {
                boleto = bankSlipSicredi(
                  Bancos,
                  customer,
                  parameter,
                  BankAccount,
                  GeradorDeDigitoPadrao,
                  nossoNumero,
                  installment,
                )
                const novoBoleto = new Boletos(boleto)
                novoBoleto.gerarBoleto()
                const stream = novoBoleto.pdfFile()

                const buffers = []
                let buffer = null
                const i = await this.installmentRepository.create({
                  ...installment,
                  ourNumber:
                    `${new Date().getFullYear().toString().slice(2)}2` +
                    boleto.beneficiario.dadosBancarios.nossoNumero +
                    boleto.beneficiario.dadosBancarios.nossoNumeroDigito,
                  digitableLine: novoBoleto.boletoInfo.getLinhaDigitavelFormatado().linha,
                  wallet: BankAccount.wallet,
                  bankAccountId: BankAccount.id,
                })
                stream.on('data', buffers.push.bind(buffers))
                stream.on('end', async () => {
                  buffer = Buffer.concat(buffers)
                  await this.installmentRepository.createBankSpliStorage({
                    installmentId: i.id,
                    companyId: i.companyId,
                    conteudo: buffer,
                    nfeId: nfe.id,
                  })
                })
              } else if (BankAccount.institution === 1) {
                boleto = bankSlipBrasil(
                  Bancos,
                  customer,
                  parameter,
                  BankAccount,
                  GeradorDeDigitoPadrao,
                  nossoNumero,
                  installment,
                )
              } else if (BankAccount.institution === 237) {
                boleto = bankSlipBradesco(
                  Bancos,
                  customer,
                  parameter,
                  BankAccount,
                  GeradorDeDigitoPadrao,
                  BankAccount.ourNumber,
                  installment,
                )
                const novoBoleto = new Boletos(boleto)
                novoBoleto.gerarBoleto()
                const stream = novoBoleto.pdfFile()

                const buffers = []
                let buffer = null
                const i = await this.installmentRepository.create({
                  ...installment,
                  ourNumber:
                    boleto.beneficiario.dadosBancarios.nossoNumero.toString() +
                    boleto.beneficiario.dadosBancarios.nossoNumeroDigito,
                  digitableLine: novoBoleto.boletoInfo.getLinhaDigitavelFormatado().linha,
                  wallet: BankAccount.wallet,
                  bankAccountId: BankAccount.id,
                })
                stream.on('data', buffers.push.bind(buffers))
                stream.on('end', async () => {
                  buffer = Buffer.concat(buffers)
                  await this.installmentRepository.createBankSpliStorage({
                    installmentId: i.id,
                    companyId: i.companyId,
                    conteudo: buffer,
                    nfeId: nfe.id,
                  })
                })
              }

              await this.bankAccountRepository.update(BankAccount)
            } else {
              await this.installmentRepository.create({
                ...installment,
                ourNumber: '',
                digitableLine: '',
              })
            }
          })
        }
      }

      await validationNfe(nfe.id, parameter)
      return nfe.id
    } catch (err) {
      throw new ApiError(`Erro Ao Processsar os dados: ${err}`, 500)
    }
  }
}
