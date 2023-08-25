import xml2js from 'xml2js'

import { Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../../prisma/types'
import { AccountPayable } from '../../entities/AccountPayable'
import { NfeProducts } from '../../entities/NfeProducts'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProviderProductsRepository } from '../../repositories/ProviderProductsRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { Cities } from '../../utils/constants'
import { IReadXmlDTO } from './ReadXmlDTO'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parse(file): Promise<any> {
  const promise = await new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({ explicitArray: false })

    parser.parseString(file, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
  return promise
}
export class ReadXmlUseCase {
  constructor(
    private providerRepository: ProviderRepository,
    private providerProductsRepository: ProviderProductsRepository,
    private productRepository: ProductRepository,
    private nfeRepository: NfeRepository,
  ) {}

  async execute(data: IReadXmlDTO, prismaTransaction: PrismaTransaction) {
    try {
      const xml = await parse(data.xml)
      const providerXml = { ...xml.nfeProc.NFe.infNFe.emit, adress: xml.nfeProc.NFe.infNFe.emit.enderEmit }
      const nfeInput = await this.nfeRepository.findNumeroNota(
        parseFloat(xml.nfeProc.NFe.infNFe.ide.nNF),
        xml.nfeProc.NFe.infNFe.emit.CNPJ,
      )
      if (nfeInput) {
        return 'Existe'
      }
      let provider = await this.providerRepository.findByCnpj(providerXml.CNPJ, data.companyId || '')
      const productsXml = Array.isArray(xml.nfeProc.NFe.infNFe.det)
        ? xml.nfeProc.NFe.infNFe.det
        : [xml.nfeProc.NFe.infNFe.det]
      const NfeProduto: NfeProducts[] = []
      if (!provider) {
        provider = await this.providerRepository.create({
          cpfCnpj: providerXml.CNPJ,
          company: providerXml.xNome,
          name: providerXml.xFant,
          email: '',
          phone: '',
          mobilePhone: '',
          dateCreated: new Date(),
          address: providerXml.adress.xLgr,
          addressNumber: providerXml.adress.nro,
          complement: '',
          province: providerXml.adress.xBairro,
          postalCode: providerXml.adress.CEP,
          companyId: data.companyId,
          cityId: parseInt(providerXml.adress.cMun),
          state: providerXml.adress.UF,
          stateInscription: providerXml.IE,
          informarGTIN: false,
        })
      }
      for (let i = 0; i < productsXml?.length; i++) {
        const prodXMl = productsXml[i].prod
        const imposto = productsXml[i].imposto

        let icms
        if (imposto.ICMS.ICMS00) {
          icms = imposto.ICMS.ICMS00
        } else if (imposto.ICMS.ICMS10) {
          icms = imposto.ICMS.ICMS10
        } else if (imposto.ICMS.ICMS20) {
          icms = imposto.ICMS.ICMS20
        } else if (imposto.ICMS.ICMS30) {
          icms = imposto.ICMS.ICMS30
        } else if (imposto.ICMS.ICMS40) {
          icms = imposto.ICMS.ICMS40
        } else if (imposto.ICMS.ICMS41) {
          icms = imposto.ICMS.ICMS41
        } else if (imposto.ICMS.ICMS50) {
          icms = imposto.ICMS.ICMS50
        } else if (imposto.ICMS.ICMS51) {
          icms = imposto.ICMS.ICMS51
        } else if (imposto.ICMS.ICMS60) {
          icms = imposto.ICMS.ICMS60
        } else if (imposto.ICMS.ICMS70) {
          icms = imposto.ICMS.ICMS70
        } else if (imposto.ICMS.ICMS51) {
          icms = imposto.ICMS.ICMS90
        }

        let product
        const prodPrivider = await this.providerProductsRepository.findByProvider(prodXMl.cProd, data.companyId || '')
        if (!prodPrivider) {
          product = await this.productRepository.findByCod(prodXMl.cProd?.replace(' ', ''))

          if (!product) {
            product = await this.productRepository.create(
              {
                description: prodXMl.xProd,
                stock: new Prisma.Decimal(0),
                stockMinium: new Prisma.Decimal(0),
                value: new Prisma.Decimal(0),
                valueOld: new Prisma.Decimal(0),
                purchaseValue: new Prisma.Decimal(prodXMl.vUnCom || 0),
                lastPurchase: new Date(),
                createAt: new Date(),
                und: prodXMl.uTrib,
                barCode: prodXMl.cEAN,
                ncm: prodXMl.NCM,
                weight: new Prisma.Decimal(0),
                height: new Prisma.Decimal(0),
                width: new Prisma.Decimal(0),
                length: new Prisma.Decimal(0),
                color: '',
                size: new Prisma.Decimal(0),
                companyId: data.companyId,
                cod: prodXMl.cProd?.replace(' ', ''),
              },
              prismaTransaction,
            )
          }
          await this.providerProductsRepository.create({
            productId: product.id,
            productIdProvider: prodXMl.cProd,
            providerId: provider.id,
            companyId: data.companyId,
          })
        } else {
          product = await this.productRepository.findById(prodPrivider?.productId || '')
        }

        NfeProduto.push({
          produto: product.id,
          descricao: product.description,
          cfop: prodXMl.CFOP,
          ncm: prodXMl.NCM,
          quantidade: new Prisma.Decimal(prodXMl.qCom || 0),
          unidade: prodXMl.uTrib,
          unitario: new Prisma.Decimal(prodXMl.vUnCom || 0),
          total: new Prisma.Decimal(prodXMl.vProd || 0),
          st: product.st,
          baseICMS: new Prisma.Decimal(icms.vBC || 0),
          valorICMS: new Prisma.Decimal(icms.vICMS || 0),
          aliquotaICMS: icms.CST === '40' ? new Prisma.Decimal(0) : new Prisma.Decimal(icms.pICMS || 0),
          baseTributo: new Prisma.Decimal(imposto.vTotTrib || 0),
          companyId: data.companyId,
          pisCofins: false,
          ipi: new Prisma.Decimal(0),
        })
      }

      const transpXML = xml.nfeProc.NFe.infNFe.transp
      const totalXML = xml.nfeProc.NFe.infNFe.total
      const installmentXml = xml.nfeProc.NFe.infNFe?.cobr?.dup
      const installments: AccountPayable[] = []
      if (installmentXml) {
        for (let j = 0; j < installmentXml?.length; j++) {
          const installment = installmentXml[j]

          installments.push({
            createdAt: xml.nfeProc.NFe.infNFe.ide.dhEmi,
            description: `Nro Nota: ${xml.nfeProc.NFe.infNFe.ide.nNF} - Parcela: ${installment.nDup}/${installmentXml?.length} `,
            dueDate: new Date(installment.dVenc),
            value: new Prisma.Decimal(installment.vDup),
            numberInstallment: parseInt(installment.nDup),
            installments: installmentXml?.length,
            providerId: provider.id,
            document: `${xml.nfeProc.NFe.infNFe.ide.nNF}/${installment.nDup}`,
            discount: new Prisma.Decimal(0),
            addition: new Prisma.Decimal(0),
            classificationId: '0ae8f9b7-ebf4-434b-8a3d-0f4ad1fe0296',
            companyId: data.companyId,
            providerName: provider.company,
          })
        }
      } else {
        installments.push({
          createdAt: xml.nfeProc.NFe.infNFe.ide.dhEmi,
          description: `Nro Nota: ${xml.nfeProc.NFe.infNFe.ide.nNF} - Parcela: 1/1 `,
          dueDate: new Date(),
          value: new Prisma.Decimal(totalXML.ICMSTot.vNF),
          numberInstallment: 1,
          installments: 1,
          providerId: provider.id,
          document: `${xml.nfeProc.NFe.infNFe.ide.nNF}`,
          discount: new Prisma.Decimal(0),
          addition: new Prisma.Decimal(0),
          classificationId: '0ae8f9b7-ebf4-434b-8a3d-0f4ad1fe0296',
          companyId: data.companyId,
          providerName: provider.company,
        })
      }
      const nfe = {
        provider,
        fornecedor: provider.id,
        cliente: null,
        razaoSocial: provider.name,
        endereco: provider.address,
        numero: provider.addressNumber,
        cidade: Cities.find(city => city.id === provider?.cityId)?.name,
        estado: provider.state,
        bairro: provider.province,
        complemento: provider.complement,
        cep: provider.postalCode,
        fone: provider.phone,
        data: xml.nfeProc.NFe.infNFe.ide.dhEmi,
        numeroNota: xml.nfeProc.NFe.infNFe.ide.nNF,
        status: '',
        tipo: 'ENTRADA',
        transpNome: '',
        volumes: parseFloat(transpXML.vol.qvol),
        especie: transpXML.vol.esp,
        pesoBruto: parseFloat(transpXML.vol.pesoB),
        pesoLiquido: parseFloat(transpXML.vol.pesoL),
        frete: parseFloat(totalXML.ICMSTot.vFrete),
        seguro: parseFloat(totalXML.ICMSTot.vSeg),
        outrasDespesas: parseFloat(totalXML.ICMSTot.vOutro),
        totalDinheiro: parseFloat(totalXML.ICMSTot.vNF),
        serie: xml.nfeProc.NFe.infNFe.ide.serie,
        baseICMS: parseFloat(totalXML.ICMSTot.vBC),
        valorICMS: parseFloat(totalXML.ICMSTot.vICMS),
        valorTributo: parseFloat(totalXML.ICMSTot.vTotTrib),
        rgIe: provider.stateInscription,
        cpfCnpj: provider.cpfCnpj,
        dataSaida: xml.nfeProc.NFe.infNFe.ide.dhSaiEnt,
        estorno: false,
        complementar: false,
        naturezaOp: xml.nfeProc.NFe.infNFe.ide.natOp,
        idCountry: 55,
        companyId: data.companyId,
        NfeProduto,
        chave: xml.nfeProc.protNFe.infProt.chNFe,
        totalNota: parseFloat(totalXML.ICMSTot.vNF),
        desconto: 0,
        vIpi: parseFloat(totalXML.ICMSTot.vIPI),
        vST: parseFloat(totalXML.ICMSTot.vST),
        installments,
      }
      return nfe
    } catch (err) {
      console.log(err)
    }
  }
}
