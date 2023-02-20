import xml2js from 'xml2js'

import { Prisma } from '@prisma/client'

import { AccountPayable } from '../../entities/AccountPayable'
import { Product } from '../../entities/Product'
import { Provider } from '../../entities/Provider'
import { ProviderProducts } from '../../entities/ProviderProducts'
import { TaxSituation } from '../../entities/TaxSituation'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProviderProductsRepository } from '../../repositories/ProviderProductsRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ApiError } from '../../utils/ApiError'
import { Cities } from '../../utils/constants'
import { IReadXmlDTO } from './ReadXmlDTO'

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
    private taxSituationsRepository: TaxSituationsRepository,
  ) {}

  validate(data: IReadXmlDTO) {
    if (!data.xml) {
      throw new ApiError('Xml é obrigatório.', 422)
    }
  }

  async execute(data: IReadXmlDTO) {
    try {
      const xml = await parse(data.xml)
      const providerXml = { ...xml.nfeProc.NFe.infNFe.emit, adress: xml.nfeProc.NFe.infNFe.emit.enderEmit }
      let provider = await this.providerRepository.findByCnpj(providerXml.CNPJ, data.companyId)
      const productsXml = Array.isArray(xml.nfeProc.NFe.infNFe.det)
        ? xml.nfeProc.NFe.infNFe.det
        : [xml.nfeProc.NFe.infNFe.det]
      const NfeProduto = []
      if (!provider) {
        provider = await this.providerRepository.create(
          Provider.create({
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
          }),
        )
      }
      for (let i = 0; i < productsXml.length; i++) {
        const prodXMl = productsXml[i].prod
        const imposto = productsXml[i].imposto

        let icms = null
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

        let taxSituation = await this.taxSituationsRepository.findByProvider(
          parseFloat(icms.pICMS || 0),
          parseInt(icms.CST),
          data.companyId,
        )
        if (!taxSituation) {
          taxSituation = await this.taxSituationsRepository.create(
            TaxSituation.create({
              description: `[${icms.CST}]: ${parseFloat(icms.pICMS || 0)}%`,
              aliquotaIcms: icms.CST === '40' ? new Prisma.Decimal(0) : new Prisma.Decimal(icms.pICMS || 0),
              cst: parseInt(icms.CST),
              simplesNacional: providerXml.CRT < 3,
              companyId: data.companyId,
            }),
          )
        }
        let product = null
        const prodPrivider = await this.providerProductsRepository.findByProvider(prodXMl.cProd, data.companyId)
        if (!prodPrivider) {
          product = await this.productRepository.create(
            Product.create({
              description: prodXMl.xProd,
              stock: new Prisma.Decimal(0),
              stockMinium: new Prisma.Decimal(0),
              value: new Prisma.Decimal(0),
              valueOld: new Prisma.Decimal(0),
              purchaseValue: new Prisma.Decimal(prodXMl.vUnCom || 0),
              lastPurchase: new Date(),
              createAt: new Date(),
              st: taxSituation.id,
              und: prodXMl.uTrib,
              barCode: prodXMl.cEAN,
              ipi: new Prisma.Decimal(0),
              ncm: prodXMl.NCM,
              cfop: prodXMl.CFOP,
              pisCofins: true,
              weight: new Prisma.Decimal(0),
              height: new Prisma.Decimal(0),
              width: new Prisma.Decimal(0),
              length: new Prisma.Decimal(0),
              color: '',
              size: new Prisma.Decimal(0),
              companyId: data.companyId,
            }),
          )
          await this.providerProductsRepository.create(
            ProviderProducts.create({
              productId: product.id,
              productIdProvider: prodXMl.cProd,
              providerId: provider.id,
              companyId: data.companyId,
            }),
          )
        } else {
          product = await this.productRepository.findById(prodPrivider.productId)
        }

        NfeProduto.push({
          produto: product.id,
          descricao: product.description,
          cfop: product.cfop,
          ncm: product.ncm,
          quantidade: parseFloat(prodXMl.qCom || 0),
          unidade: prodXMl.uTrib,
          unitario: new Prisma.Decimal(prodXMl.vUnCom || 0),
          total: new Prisma.Decimal(prodXMl.vProd || 0),
          st: product.st,
          baseICMS: parseFloat(icms.vBC || 0),
          valorICMS: parseFloat(icms.vICMS || 0),
          aliquotaICMS: icms.CST === '40' ? new Prisma.Decimal(0) : new Prisma.Decimal(icms.pICMS || 0),
          baseTributo: new Prisma.Decimal(imposto.vTotTrib || 0),
          companyId: data.companyId,
        })
      }

      const transpXML = xml.nfeProc.NFe.infNFe.transp
      const totalXML = xml.nfeProc.NFe.infNFe.total
      const installmentXml = xml.nfeProc.NFe.infNFe?.cobr?.dup
      const installments = []
      if (installmentXml) {
        for (let j = 0; j < installmentXml.length; j++) {
          const installment = installmentXml[j]

          installments.push(
            AccountPayable.create({
              createdAt: xml.nfeProc.NFe.infNFe.ide.dhEmi,
              description: `Nro Nota: ${xml.nfeProc.NFe.infNFe.ide.nNF} - Parcela: ${installment.nDup}/${installmentXml.length} `,
              dueDate: new Date(installment.dVenc),
              value: new Prisma.Decimal(installment.vDup),
              numberInstallment: parseInt(installment.nDup),
              installments: installmentXml.length,
              providerId: provider.id,
              document: `${xml.nfeProc.NFe.infNFe.ide.nNF}/${installment.nDup}`,
              discount: new Prisma.Decimal(0),
              addition: new Prisma.Decimal(0),
              classificationId: '0ae8f9b7-ebf4-434b-8a3d-0f4ad1fe0296',
              companyId: data.companyId,
              providerName: provider.company,
            }),
          )
        }
      } else {
        AccountPayable.create({
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
        cidade: Cities.find(city => city.id === provider.cityId).name,
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
