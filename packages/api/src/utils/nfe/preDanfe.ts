import { format } from 'date-fns'
import { minify } from 'minify-xml'
import { SignedXml } from 'xml-crypto'
import xml2js from 'xml2js'

import { prisma } from '../../database/client'
import { Parameter } from '../../entities/Parameter'
import { FinNFe } from '../../enum/finNFe'
import { IndPres } from '../../enum/indPres'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'
import { NfeRepository } from '../../repositories/NfeRepository'
import { cfopDevolution } from '../../utils/cfopDevolution'
import { getCBenef } from '../../utils/getCBenef'
import { getICMS } from '../../utils/getICMS'
import { getIdDest } from '../../utils/getIdDest'
import { getInterstateAliquot } from '../../utils/getInterstateAliquot'
import { getNumericCode } from '../../utils/getNumericCode'
import { getStateAliquot } from '../../utils/getStateAliquot'
import { getStateFundoPobreza } from '../../utils/getStateFundoPobreza'
import { getVerifyingDigit } from '../../utils/getVerifyingDigit'
import { readPkcs12Async } from '../../utils/readPkcs12Async'
import { removeAccents } from '../../utils/removeAccents'
import { removeEmpty } from '../../utils/removeEmpty'
import { version } from '../../version'

class nfeDados {
  id: string
  numeroNota?: number
  estado?: string
  tipoFrete?: number
  cpfCnpj?: string
  tipo: string
  IE?: string
  naturezaOp?: string
  data: Date
  dataSaida: Date
  estorno: boolean
  chave?: string
  serie?: number
  razaoSocial?: string
  endereco?: string
  complemento?: string
  bairro?: string
  numero?: string
  cep?: string
  cidade?: string
  fone?: string
  email?: string
  complementar: boolean
  NFeRef?: string
  observacoes?: string
  transpCpfCnpj?: string
  transpRgIe?: string
  transpNome?: string
  transpEndereco?: string
  transpCidade?: string
  transpEstado?: string
  descCountry?: string
  taxpayerType?: number
  nDi?: string
  dDi: Date
  InformarGTIN?: boolean
  totalDinheiro?: number
  totalCartaoCredito?: number
  totalCartaoDebito?: number
  totalCheque?: number
  totalBoleto?: number
  totalOutros?: number
  frete?: number
  totalProduto?: number
  desconto?: number
  qtdeProdutos?: number
  seguro?: number
  outrasDespesas?: number
  pesoLiquido?: number
  pesoBruto?: number
  especie?: string
  idCountry?: number
  tpViaTransp?: number
  UFDesemb?: string
  cExportador?: string
  xLocDesemb?: string
  volumes?: number
}

class nfeProdDados {
  nota?: string
  cfop: string
  cf?: number
  quantidade?: number
  quantidadeRef?: number
  peso?: number
  unitario?: number
  st: number
  valorBaseIcms?: number
  valorICMS?: number
  aliquotaICMS?: number
  baseTributo?: number
  alqPis?: number
  alqCofins?: number
  cstPis?: string
  cstCofins?: string
  cest?: string
  ncm?: string
  descricao?: string
  unidade?: string
  produto?: string
  cod?: string
  uTrib?: string
  gTin?: string
}

export async function preDanfeNFe(id: string, parameters: Parameter) {
  if (id && parameters && parameters.nfeCnpj && parameters.passwordCert && parameters.pfx) {
    const nfeRepository = new NfeRepository()
    const notas = await prisma.$queryRaw<nfeDados[]>`SELECT
  nfe."id",
  "numeroNota",
  "estado",
  "tipoFrete",
  "tipo",
  "naturezaOp",
  "data",
  "dataSaida",
  "estorno",
  "chave",
  "serie",
  "razaoSocial",
  "endereco",
  "complemento",
  "bairro",
  "numero",
  "cep",
  "cidade",
  "fone",
  "complementar",
  "nfeRef",
  "observacoes",
  "transpCpfCnpj",
  "transpRgIe",
  "transpNome",
  "transpEndereco",
  "transpCidade",
  "transpEstado",
  "descCountry",
  "taxpayerType",
  "nDi",
  "dDi",
  "totalDinheiro",
  "totalCartaoCredito",
  "totalCartaoDebito",
  "totalCheque",
  "totalBoleto",
  "totalOutros",
  "frete",
  "totalProduto",
  "desconto",
  "qtdeProdutos",
  "seguro",
  "outrasDespesas",
  "pesoLiquido",
  "pesoBruto",
  "especie",
  "idCountry",
  "tpViaTransp",
  "uFDesemb",
  "cExportador",
  "xLocDesemb",
  "volumes",
  (case when nfe."cpfCnpj" is null then  '' else nfe."cpfCnpj" end) as "cpfCnpj",
  nfe."rgIe" as "IE",
  (case when nfe."cliente" is null then  provider."email" else customer."email" end) as "email",
  (case when nfe."cliente" is null then provider."informarGTIN" else customer."informarGTIN" end) as "InformarGTIN"
   FROM nfe
   LEFT JOIN customer ON nfe.cliente = customer.id
   LEFT JOIN provider ON nfe.fornecedor = provider.id
   WHERE nfe.id = ${id}`
    const allProducts = await prisma.$queryRaw<nfeProdDados[]>`SELECT
  nfe_produto."nota",
  nfe_produto."cfop",
  nfe_produto."cf",
  nfe_produto."quantidade",
  nfe_produto."quantidadeRef",
  nfe_produto."unitario",
  nfe_produto."st",
  nfe_produto."valorBaseIcms",
  nfe_produto."valorICMS",
  nfe_produto."aliquotaICMS",
  nfe_produto."baseTributo",
  nfe_produto."alqPis",
  nfe_produto."alqCofins",
  nfe_produto."cstPis",
  nfe_produto."cstCofins",
  nfe_produto."cest",
  nfe_produto."ncm",
  product."description" as "descricao",
  nfe_produto."unidade",
  nfe_produto."produto",
  nfe_produto."cod",
  ibpt."uTrib" as uTrib,
  product."barCode" as gTin,
  product."weight" as peso
  FROM nfe_produto
  LEFT JOIN ibpt ON ibpt."NCM_NBS" =nfe_produto.ncm
  LEFT JOIN product ON product.id = nfe_produto.produto
  WHERE nfe_produto.nota = ${id}`
    const tpAmb = parameters.nfeHomologation ? 2 : 1
    const certPem = await readPkcs12Async(parameters.pfx, {
      p12Password: atob(parameters.passwordCert),
    })
    if (notas) {
      const xmls = notas.map(nota => {
        const products = allProducts.filter(product => product.nota === nota.id)
        const cfop = products[0]?.cfop
        const isDevolution = cfopDevolution.includes(cfop)
        const infGTIN = nota.InformarGTIN
        const isExternal = ['7', '3'].includes(cfop[0])
        const isExternalEnter = cfop[0] === '3'
        const isNormalRegime = parameters.nfeCrt === 3
        let indIEDest = 9
        const customerState = isExternal ? 'EX' : nota.estado
        let exporta
        let transporta
        let DI
        let isOpInterstate = false
        if (cfop[0]?.toString() === '6' && isNormalRegime) isOpInterstate = true
        const tipoFrete = nota.tipoFrete || 9
        if (nota.taxpayerType) {
          if (nota.taxpayerType === 1) indIEDest = 1
          else if (nota.taxpayerType === 2) indIEDest = 2
          else indIEDest = 9
        } else {
          if (nota.cpfCnpj?.length || 0 > 11 || nota.tipo === 'ENTRADA') {
            if ((nota.IE || '').toLowerCase().startsWith('isent')) {
              indIEDest = 2
            } else if (nota.IE) indIEDest = 1
          } else {
            indIEDest = 9
          }
        }
        if (customerState === 'EX') indIEDest = 9
        const cUF = stateCode[parameters.nfeUf || 'SP']
        const mod = 55
        if (isExternal && !isExternalEnter) {
          exporta = { UFSaidaPais: parameters.nfeUf, xLocExporta: parameters.nfeCidade }
        }
        if (tipoFrete !== 9) {
          transporta = {
            CNPJ: nota?.transpCpfCnpj?.length || 0 > 11 ? nota.transpCpfCnpj : null,
            CPF: nota.transpCpfCnpj?.length === 11 ? nota.transpCpfCnpj : null,
            xNome: removeAccents(nota?.transpNome || '')?.replace(/’/g, ' '),
            IE: nota.transpRgIe?.replace(/\D/g, ''),
            xEnder: nota.transpEndereco || null,
            xMun: removeAccents(nota.transpCidade || ''),
            UF: nota.transpEstado ?? parameters.nfeUf,
          }
        }

        let indPres = Number(parameters.nfeIndPresenca)
        let indIntermed
        let finNFe = FinNFe.Normal
        let natOp = removeAccents(nota.naturezaOp || '')

        if (isDevolution || nota.estorno) {
          finNFe = FinNFe.Devolucao
          indPres = IndPres.NaoAplica
        } else if (nota.complementar) {
          finNFe = FinNFe.Complementar
          indPres = IndPres.NaoAplica
          natOp = 'Complemento de imposto nao destacado na nota origina'
        } else if (isExternalEnter) {
          natOp = 'IMPORTAÇÃO'
          indPres = IndPres.NaoAplica
        }
        if ((indPres = IndPres.Internet)) {
          indIntermed = 0
        }
        const cNF = getNumericCode()
        const data = format(new Date(nota.data), 'yyMM')
        const cnpj = parameters.nfeCnpj?.padStart(14, '0')
        const serie = String(nota.serie).padStart(3, '0')
        const numero = String(nota.numeroNota).padStart(9, '0')

        const tpEmis = 1

        let nfeId = `${cUF}${data}${cnpj}${mod}${serie}${numero}${tpEmis}${cNF}`
        nfeId = `NFe${nfeId}${getVerifyingDigit(nfeId)}`
        nota.chave = nfeId
        const documentName = nota?.cpfCnpj?.length || 0 < 14 ? 'CPF' : 'CNPJ'
        const customercpfCnpj =
          nota?.cpfCnpj?.length || 0 < 14
            ? String(Number(nota.cpfCnpj)).padStart(11, '0')
            : String(Number(nota.cpfCnpj)).padStart(14, '0')
        const customerName = parameters.nfeHomologation
          ? 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
          : removeAccents(nota.razaoSocial || '')
              .replace(/’/g, ' ')
              .replace(/–/g, ' ')
              .replace(/•/g, ' ')
              .replace(/“/g, ' ')
              .replace(/”/g, ' ')
              .replace(/—/g, ' ')
              .trim()
        const customerEnd = removeAccents(nota.endereco || '')
          .replace(/'/g, ' ')
          .replace(/’/g, ' ')
          .replace(/–/g, ' ')
          .replace(/•/g, ' ')
          .replace(/“/g, ' ')
          .replace(/”/g, ' ')
          .replace(/—/g, ' ')
          .trim()

        const customerCompl = nota.complemento
          ? removeAccents(nota.complemento)
              .replace(/'/g, ' ')
              .replace(/’/g, ' ')
              .replace(/–/g, ' ')
              .replace(/•/g, ' ')
              .replace(/“/g, ' ')
              .replace(/”/g, ' ')
              .replace(/—/g, ' ')
              .trim()
          : ''

        const customerBairro = removeAccents(nota.bairro || '')
          .replace(/'/g, ' ')
          .replace(/’/g, ' ')
          .replace(/–/g, ' ')
          .replace(/•/g, ' ')
          .replace(/“/g, ' ')
          .replace(/”/g, ' ')
          .replace(/—/g, ' ')
          .trim()
        const customerCityCode = isExternal ? 9999999 : getCityCode(nota.cidade || '', stateCode[nota.estado || 'SP'])
        const customerCity = isExternal ? 'Exterior' : removeAccents(nota.cidade || '')

        const customerCountry = isExternal ? nota.descCountry : 'Brasil'

        let tPag = '90'
        let xPag
        let vPag = '0.00'
        if (!nota.estorno && !isDevolution && !nota.complementar) {
          if ((nota.totalDinheiro || 0) > 0) {
            tPag = '01'
            vPag = (nota.totalDinheiro || 0).toFixed(2)
          } else if ((nota.totalCheque || 0) > 0) {
            tPag = '02'
            vPag = (nota.totalCheque || 0)?.toFixed(2)
          } else if ((nota.totalCartaoCredito || 0) > 0) {
            tPag = '03'
            vPag = (nota.totalCartaoCredito || 0).toFixed(2)
          } else if ((nota.totalCartaoDebito || 0) > 0) {
            tPag = '04'
            vPag = (nota.totalCartaoDebito || 0).toFixed(2)
          } else if ((nota.totalBoleto || 0) > 0) {
            tPag = '15'
            vPag = (nota.totalBoleto || 0).toFixed(2)
          } else if ((nota.totalOutros || 0) > 0) {
            tPag = '99'
            xPag = 'Mercado Pago'
            vPag = (nota.totalOutros || 0).toFixed(2)
          }
        }

        let totalTrib = 0
        let totalBaseIcms = 0
        let totalVlIcms = 0
        let totalProduct = 0
        let totalProductNota = 0
        let totalDesc = 0
        let totalFrete = 0
        let totalOutro = 0
        let totalICMSUFDest = 0
        let totalFCPUFDest = 0
        let totalPis = 0
        let totalCofins = 0

        let totalitem = 0
        const det = products
          .map((product, i) => {
            const fundoPobreza = getStateFundoPobreza(nota.estado || 'SP')
            const stateAliquot = getStateAliquot(nota.estado || 'SP') - fundoPobreza
            let interstateAliquot = getInterstateAliquot('SP', nota.estado || 'SP')
            if (product.cf === 1 || product.cf === 2) interstateAliquot = 4
            const diffAliquot = stateAliquot - interstateAliquot
            const gTIN = product.gTin
            const productCfop = product.cfop ?? cfop
            const isProdAnp = productCfop.includes('.656')
            totalitem = totalitem + 1
            const quantity = nota.complementar
              ? (product.quantidade || 0) - (product.quantidadeRef || 0)
              : product.quantidade
            const pesoproduto = !product.peso ? 0 : product.peso
            let priceArred = 0
            let descArred = 0
            let freteArred = 0
            let outroArred = 0
            const unitPrice = nota.complementar && !quantity ? 0 : product.unitario
            const price = ((unitPrice || 0) * (quantity || 0))?.toFixed(2)
            const valorprod = (unitPrice || 0) * (quantity || 0)

            totalProduct = totalProduct + parseFloat(price)
            priceArred = parseFloat(price)

            if (totalProduct > (nota.totalProduto || 0))
              priceArred = parseFloat(price) - (totalProduct - (nota.totalProduto || 0))
            else if (totalitem === nota.qtdeProdutos)
              priceArred = parseFloat(price) + ((nota.totalProduto || 0) - totalProduct)
            const vFretes = ((priceArred * (nota.frete || 0)) / (nota.totalProduto || 0))?.toFixed(2)
            if (totalFrete === nota.frete) freteArred = 0
            else {
              totalFrete = totalFrete + parseFloat(vFretes)
              freteArred = parseFloat(vFretes)

              if (totalFrete > (nota.frete || 0)) freteArred = parseFloat(vFretes) - (totalFrete - (nota.frete || 0))
              else if (totalitem === nota.qtdeProdutos)
                freteArred = parseFloat(vFretes) + ((nota.frete || 0) - totalFrete)
            }
            const vOutros = ((priceArred * (nota.outrasDespesas || 0)) / (nota.totalProduto || 0))?.toFixed(2)
            if (totalOutro === nota.outrasDespesas) freteArred = 0
            else {
              totalOutro = totalOutro + parseFloat(vOutros)
              outroArred = parseFloat(vOutros)

              if (totalOutro > (nota.outrasDespesas || 0))
                outroArred = parseFloat(vOutros) - (totalOutro - (nota.outrasDespesas || 0))
              else if (totalitem === nota.qtdeProdutos)
                outroArred = parseFloat(vOutros) + ((nota.outrasDespesas || 0) - totalOutro)
            }
            const vDescs = ((priceArred * (nota.desconto || 0)) / (nota.totalProduto || 0))?.toFixed(2)

            if (totalDesc === nota.desconto) descArred = 0
            else {
              totalDesc = totalDesc + parseFloat(vDescs)
              descArred = parseFloat(vDescs)
              if (totalDesc > (nota.desconto || 0)) descArred = parseFloat(vDescs) - (totalDesc - (nota.desconto || 0))
              else if (totalitem === nota.qtdeProdutos)
                descArred = parseFloat(vDescs) + ((nota.desconto || 0) - totalDesc)
            }
            const uCom = product.unidade ?? 'UND'

            const vBCUFDest = priceArred + freteArred
            let pFCPUFDest = fundoPobreza
            let pICMSUFDest = stateAliquot
            let vFCPUFDest = vBCUFDest * (fundoPobreza / 100)
            let vICMSUFDest = vBCUFDest * (diffAliquot / 100)

            if ([30, 40, 41, 103, 300, 400].includes(product.st)) {
              pFCPUFDest = 0
              pICMSUFDest = 0
              vFCPUFDest = 0
              vICMSUFDest = 0
            }

            if (product.st === 0 || product.st === 20) {
              if (product.valorBaseIcms === 0) product.valorBaseIcms = valorprod - descArred
              product.valorBaseIcms = (product.valorBaseIcms || 0) - descArred
              product.valorICMS = (product.valorBaseIcms * (product.aliquotaICMS || 0)) / 100
              totalBaseIcms += product.valorBaseIcms
              totalVlIcms += product.valorICMS
            } else {
              totalVlIcms += 0
              totalBaseIcms += 0
            }
            totalTrib = totalTrib + (product.baseTributo || 0)

            totalProductNota += valorprod

            totalICMSUFDest += vICMSUFDest
            totalFCPUFDest += vFCPUFDest

            if (isExternalEnter && !isDevolution) {
              DI = {
                nDI: nota.nDi,
                dDI: format(nota.dDi ? new Date(nota.dDi) : new Date(nota.data), 'yyyy-MM-dd'),
                xLocDesemb: nota.xLocDesemb,
                UFDesemb: nota.UFDesemb,
                dDesemb: format(nota.dDi ? new Date(nota.dDi) : new Date(nota.data), 'yyyy-MM-dd'),
                tpViaTransp: nota.tpViaTransp,
                vAFRMM: 0.0,
                tpIntermedio: 1,
                cExportador: nota.cExportador,
                adi: { nAdicao: totalitem, nSeqAdic: totalitem, cFabricante: nota.cExportador },
              }
            }
            let _pis = {}
            let _cofins = {}
            const perCofins = product.alqCofins || 0
            const perPis = product.alqPis || 0
            if (product.cstPis === '7' || product.cstPis === '07') {
              _pis = { PISNT: { CST: '07' } }
              _cofins = { COFINSNT: { CST: '07' } }
            } else if (product.cstPis === '6' || product.cstPis === '06') {
              _pis = { PISNT: { CST: '06' } }
              _cofins = { COFINSNT: { CST: '06' } }
            } else if (product.cstPis === '4' || product.cstPis === '04') {
              _pis = { PISNT: { CST: '04' } }
              _cofins = { COFINSNT: { CST: '04' } }
            } else if (product.cstPis === '49' || product.cstPis === '99') {
              _pis = {
                PISOutr: {
                  CST: product.cstPis ? product.cstPis.padStart(2, '0') : '99',
                  qBCProd: '0.0000',
                  vAliqProd: '0.0000',
                  vPIS: '0.00',
                },
              }
              _cofins = {
                COFINSOutr: {
                  CST: product.cstCofins ? product.cstCofins.padStart(2, '0') : '99',
                  qBCProd: '0.0000',
                  vAliqProd: '0.0000',
                  vCOFINS: '0.00',
                },
              }
            } else {
              _pis = {
                PISAliq: {
                  CST: product.cstPis ? product.cstPis.padStart(2, '0') : '01',
                  vBC: valorprod?.toFixed(2),
                  pPIS: perPis?.toFixed(4),
                  vPIS: ((valorprod * perPis) / 100)?.toFixed(2),
                },
              }
              _cofins = {
                COFINSAliq: {
                  CST: product.cstCofins ? product.cstCofins.padStart(2, '0') : '01',
                  vBC: valorprod?.toFixed(2),
                  pCOFINS: perCofins?.toFixed(4),
                  vCOFINS: ((valorprod * perCofins) / 100)?.toFixed(2),
                },
              }
              totalCofins += (valorprod * perCofins) / 100
              totalPis += (valorprod * perPis) / 100
            }

            return removeEmpty({
              $: { nItem: i + 1 },
              prod: {
                cProd: nota.complementar ? 'CFOP 5.949' : product.cod ? product.cod : product.produto,
                cEAN: (isDevolution || nota.estorno) && infGTIN ? gTIN : 'SEM GTIN',
                xProd: nota.complementar
                  ? 'NOTA FISCAL COMPLEMENTAR'
                  : removeAccents(product.descricao || '')
                      .replace(/[^\w.@-]/g, ' ')
                      .trim(),
                NCM: product.ncm,
                CEST: product.st === 60 ? product.cest : null,
                cBenef: getCBenef(product.st),
                CFOP: productCfop?.replace(/\D/g, ''),
                uCom,
                qCom: quantity?.toFixed(4),
                vUnCom: unitPrice?.toFixed(4),
                vProd: price,
                cEANTrib: (isDevolution || nota.estorno) && infGTIN ? gTIN : 'SEM GTIN',
                uTrib: isProdAnp ? 'KG' : product.uTrib && isExternal ? product.uTrib : uCom,
                qTrib: isExternal ? (pesoproduto * (quantity || 0))?.toFixed(4) : quantity?.toFixed(4),
                vUnTrib: isExternal
                  ? (priceArred / (pesoproduto * (quantity || 0)))?.toFixed(4)
                  : unitPrice?.toFixed(4),
                vFrete: freteArred && !nota.complementar ? freteArred?.toFixed(2) : null,
                vOutro: outroArred && !nota.complementar ? outroArred?.toFixed(2) : null,
                vDesc:
                  descArred && !nota.complementar && descArred.toFixed(2) !== '0.00' && descArred > 0
                    ? descArred?.toFixed(2)
                    : null,
                indTot: 1,
                DI,
              },

              imposto: {
                vTotTrib: product.baseTributo?.toFixed(2),
                ICMS: getICMS(
                  product.cf || 0,
                  product.st,
                  product.valorBaseIcms || 0,
                  product.aliquotaICMS || 0,
                  product.valorICMS || 0,
                ),
                PIS: _pis,
                COFINS: _cofins,
                ICMSUFDest:
                  isOpInterstate && indIEDest === 9
                    ? {
                        vBCUFDest: vBCUFDest?.toFixed(2),
                        pFCPUFDest: pFCPUFDest?.toFixed(2),
                        pICMSUFDest: pICMSUFDest?.toFixed(2),
                        pICMSInter: interstateAliquot?.toFixed(2),
                        pICMSInterPart: '100.00',
                        vFCPUFDest: vFCPUFDest?.toFixed(2),
                        vICMSUFDest: vICMSUFDest?.toFixed(2),
                        vICMSUFRemet: '0.00',
                      }
                    : null,
              },
            })
          })
          .sort(prod => prod.descricao)
        const totalNota =
          totalProductNota - (nota.desconto || 0) + (nota.frete || 0) + (nota.seguro || 0) + (nota.outrasDespesas || 0)

        let NFref
        if (nota.estorno || isDevolution) {
          if (nota.NFeRef) {
            NFref = { refNFe: nota.NFeRef?.replace('NFe', '') }
          }
        }

        const infCpl = nota.observacoes

        const ide = {
          cUF,
          cNF,
          natOp,
          mod,
          serie: nota.serie,
          nNF: nota.numeroNota,
          dhEmi: format(new Date(nota.data), "yyyy-MM-dd'T'HH:mm:ssxxx"),
          dhSaiEnt: nota.dataSaida ? format(new Date(nota.dataSaida), "yyyy-MM-dd'T'HH:mm:ssxxx") : null,
          tpNF: nota.tipo === 'ENTRADA' ? 0 : 1,
          idDest: getIdDest(cfop, nota.estado || 'SP', isExternal, parameters.nfeUf || 'SP'),
          cMunFG: parameters.nfeCidadeCod,
          tpImp: 1,
          tpEmis,
          cDV: getVerifyingDigit(nfeId),
          tpAmb,
          finNFe,
          indFinal: 1,
          indPres,
          indIntermed,
          procEmi: 0,
          verProc: version,
          NFref,
        }

        return {
          NFe: {
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
            infNFe: {
              $: { versao: '4.00', Id: nfeId },
              ide,
              emit: {
                CNPJ: parameters.nfeCnpj,
                xNome: parameters.nfeRazao,
                xFant: parameters.nfeFantasia,
                enderEmit: {
                  xLgr: parameters.nfeLagradouro,
                  nro: parameters.nfeNumero,
                  xBairro: parameters.nfeBairro,
                  cMun: parameters.nfeCidadeCod,
                  xMun: parameters.nfeCidade,
                  UF: parameters.nfeUf,
                  CEP: parameters.nfeCep?.replace(/\D/g, ''),
                  cPais: 1058,
                  fone: parameters.nfeFone?.replace(/\D/g, ''),
                },
                IE: parameters.nfeIe,
                IM: parameters.nfeIm,
                CNAE: parameters.nfeCnae,
                CRT: parameters.nfeCrt,
              },
              dest: {
                idEstrangeiro: isExternal ? '' : null,
                [documentName]: isExternal ? null : customercpfCnpj,
                xNome: customerName.length > 60 ? customerName.substring(0, 60) : customerName,
                enderDest: {
                  xLgr: customerEnd.length > 60 ? customerEnd.substring(0, 60) : customerEnd,
                  nro: nota.numero,
                  xCpl: customerCompl === '' ? null : customerCompl,
                  xBairro: customerBairro,
                  cMun: customerCityCode,
                  xMun: customerCity,
                  UF: customerState,
                  CEP: nota.cep?.replace(/\D/g, ''),
                  cPais: isExternal ? nota.idCountry : null,
                  xPais: customerCountry,
                  fone: nota.fone || null,
                },
                indIEDest,
                IE: indIEDest === 1 ? nota.IE?.replace(/\D/g, '') : null,
                email: nota.email || null,
              },
              det,
              total: {
                ICMSTot: {
                  vBC: totalBaseIcms?.toFixed(2),
                  vICMS: totalVlIcms?.toFixed(2),
                  vICMSDeson: 0,
                  vFCPUFDest: isOpInterstate ? totalFCPUFDest?.toFixed(2) : null,
                  vICMSUFDest: isOpInterstate && indIEDest === 9 ? totalICMSUFDest?.toFixed(2) : null,
                  vICMSUFRemet: isOpInterstate ? '0.00' : null,
                  vFCP: '0.00',
                  vBCST: '0.00',
                  vST: '0.00',
                  vFCPST: '0.00',
                  vFCPSTRet: '0.00',
                  vProd: totalProductNota?.toFixed(2),
                  vFrete: nota.frete ? nota.frete?.toFixed(2) : '0.00',
                  vSeg: nota.seguro ? nota.seguro?.toFixed(2) : '0.00',
                  vDesc: nota.desconto ? nota.desconto?.toFixed(2) : '0.00',
                  vII: '0.00',
                  vIPI: '0.00',
                  vIPIDevol: '0.00',
                  vPIS: totalPis?.toFixed(2) || 0,
                  vCOFINS: totalCofins?.toFixed(2) || 0,
                  vOutro: nota.outrasDespesas ? nota.outrasDespesas?.toFixed(2) : '0.00',
                  vNF: nota.complementar ? '0.00' : totalNota?.toFixed(2),
                  vTotTrib: totalTrib?.toFixed(2),
                },
              },

              transp: {
                modFrete: tipoFrete,
                transporta,
                vol: {
                  qVol: nota.volumes,
                  esp: nota.especie,
                  pesoL: nota.pesoLiquido?.toFixed(3),
                  pesoB: nota.pesoBruto?.toFixed(3),
                },
              },
              pag: { detPag: { tPag, xPag, vPag } },
              infAdic: {
                infCpl:
                  removeAccents(infCpl || '')
                    .replace(/'/g, ' ')
                    .replace(/’/g, ' ')
                    .replace(/[\n\r]/g, ' ')
                    .replace(/–/g, ' ')
                    .replace(/•/g, ' ')
                    .replace(/->/g, ' ')
                    .replace(/“/g, ' ')
                    .replace(/”/g, ' ')
                    .replace(/—/g, ' ')
                    .trim() || null,
              },
              exporta,
              infRespTec: {
                CNPJ: '22540716000114',
                xContato: 'Suporte',
                email: 'suporte@expertisp.com.br',
                fone: '1839033930',
              },
            },
          },
        }
      })

      let nfeXml = ''
      let nfeId
      const items = xmls.map(xmlObj => {
        const builder = new xml2js.Builder({ headless: true })
        const xml = minify(builder.buildObject(removeEmpty(xmlObj)))
        const sig = new SignedXml({
          privateKey: certPem.key,
          publicCert: certPem.cert,
          canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
        })

        sig.addReference({
          xpath: "//*[local-name(.)='infNFe']",
          transforms: [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
          ],
        })

        sig.computeSignature(xml, {
          location: { reference: "//*[local-name(.)='infNFe']", action: 'after' },
        })

        const signedXml = sig.getSignedXml()

        nfeId = xmlObj.NFe.infNFe.$.Id.replace('NFe', '')
        nfeXml = signedXml

        return signedXml
      })

      const lote = `<enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    <idLote>${+new Date()}</idLote>
    <indSinc>0</indSinc>
    ${items.join('')}
  </enviNFe>`
      const requestData = minify(
        `<?xml version="1.0" encoding="utf-8" ?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body><nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">${lote}</nfeDadosMsg></soap12:Body></soap12:Envelope>`,
      )

      try {
        if (requestData.length < 500000 && nfeId !== '') {
          await nfeRepository.createNfeStorage({
            nome: nfeId + '-nfe.xml',
            conteudo: Buffer.from(nfeXml, 'utf-8'),
            companyId: parameters.companyId,
          })
          for (const nota of notas) {
            await prisma.$queryRaw`UPDATE nfe SET chave=${nota.chave} WHERE id = ${nota.id}`
          }
          return true
        }
      } catch (err) {
        console.log(err)
      }
      prisma.$disconnect()
    }
  }
}
