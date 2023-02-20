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
import { nfeAutorizacao } from '../../service/nfeAutorizacao'
import { cfopDevolution } from '../../utils/cfopDevolution'
import { getCBenef } from '../../utils/getCBenef'
import { getICMS } from '../../utils/getICMS'
import { getIdDest } from '../../utils/getIdDest'
import { getInterstateAliquot } from '../../utils/getInterstateAliquot'
import { getNumericCode } from '../../utils/getNumericCode'
import { getStateAliquot } from '../../utils/getStateAliquot'
import { getStateFundoPobreza } from '../../utils/getStateFundoPobreza'
import { getVerifyingDigit } from '../../utils/getVerifyingDigit'
import { logger } from '../../utils/logger'
import { readPkcs12Async } from '../../utils/readPkcs12Async'
import { removeAccents } from '../../utils/removeAccents'
import { removeEmpty } from '../../utils/removeEmpty'
import { version } from '../../version'
import { KeyInfo } from './keyInfo'

export async function sendNFe(id: string, parameters: Parameter) {
  const nfeRepository = new NfeRepository()
  const notas = await prisma.$queryRaw<any[]>`SELECT
  nfe.id,
  complementar,
  nfe.complemento,
  nfe.cidade,
  nfe.cep,
  (case when nfe."cpfCnpj" is null then  '' else nfe."cpfCnpj" end) as "cpfCnpj",
  "descCountry",
  "idCountry",
  nfe.fone,
  "tipoFrete",
  frete,
  "numeroNota",
  "transpNome",
  "transpEstado",
  "transpCpfCnpj",
  "transpRgIe",
  "transpEndereco",
  "transpCidade",
  volumes,
  especie,
  "pesoBruto",
  "pesoLiquido",
  nfe.bairro,
  nfe.numero,
  serie,
  data,
  "dataSaida",
  tipo,
  "naturezaOp",
  nfe.estado,
  estorno,
  nfe.endereco,
  "razaoSocial",
  nfe."rgIe" as "IE",
  (case when cliente is null then  provider."email" else customer.email end) as email,
  seguro,
  desconto,
  "outrasDespesas",
  "totalDinheiro",
  "totalCheque",
  "totalBoleto",
  "totalCartaoCredito",
  "totalCartaoDebito",
  "totalOutros",
  "totalProduto",
  "totalNota",
  "nfeRef",
  observacoes,
  "qtdeProdutos",
  "nDi",
  "dDi",
  "xLocDesemb",
  "uFDesemb",
  "tpViaTransp",
  "cExportador",
  nfe."companyId",
  (case when cliente is null then provider."informarGTIN" else customer."informarGTIN" end) as "InformarGTIN"
  FROM nfe
  LEFT JOIN customer ON nfe.cliente = customer.id
  LEFT JOIN provider ON nfe.fornecedor = provider.id
  WHERE nfe.id = ${id} `
  const allProducts = await prisma.$queryRaw<any[]>`SELECT
  nfe_produto.produto,
  nfe_produto."baseTributo",
  nfe_produto.nota,
  nfe_produto.descricao,
  nfe_produto.unidade,
  nfe_produto.cfop,
  nfe_produto.ncm,
  nfe_produto.st,
  nfe_produto.cf,
  nfe_produto."baseICMS",
  nfe_produto."valorICMS",
  nfe_produto."aliquotaICMS",
  nfe_produto.quantidade,
  nfe_produto."quantidadeRef",
  nfe_produto.unitario,
  ibpt."uTrib",
  nfe_produto."refProduto",
  nfe_produto."pisCofins",
  nfe_produto."cstPis",
  nfe_produto."alqPis",
  nfe_produto."cstCofins",
  nfe_produto."alqCofins",
  nfe_produto.cod,
  product.weight as peso,
  CASE WHEN nfe_produto."refProduto" = '0' THEN CAST(nfe_produto.produto AS VARCHAR) ELSE nfe_produto."refProduto" END AS "cProd" FROM nfe_produto
  LEFT JOIN ibpt ON ibpt."NCM_NBS" =nfe_produto.ncm
  LEFT JOIN product ON product.id = nfe_produto.produto
  WHERE nfe_produto.nota = ${id}`
  const allRefs = await prisma.$queryRaw<any[]>`SELECT id, nota FROM nfe_ref WHERE nota = ${id}`
  const tpAmb = parameters.nfeHomologation ? 2 : 1
  const certPem = await readPkcs12Async(parameters.pfx, {
    p12Password: atob(parameters.passwordCert),
  })

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
    let exporta = null
    let transporta = null
    let DI = null
    const tipoFrete = nota.tipoFrete || 9
    if (nota.cpfCnpj.length > 11) {
      if ((nota.IE || '').toLowerCase().startsWith('isent')) {
        indIEDest = 2
      } else if (nota.IE) indIEDest = 1
    } else {
      indIEDest = 9
    }
    let isOpInterstate = false
    if (customerState === 'EX') indIEDest = 9
    if (cfop[0].toString() === '6' && isNormalRegime) isOpInterstate = true
    const cUF = stateCode[parameters.nfeUf]
    const mod = 55
    if (isExternal && !isExternalEnter) {
      exporta = { UFSaidaPais: parameters.nfeUf, xLocExporta: parameters.nfeCidade }
    }
    if (tipoFrete !== 9) {
      transporta = {
        CNPJ: nota.transpCpfCnpj?.length > 11 ? nota.transpCpfCnpj : null,
        CPF: nota.transpCpfCnpj?.length === 11 ? nota.transpCpfCnpj : null,
        xNome: removeAccents(nota.transpNome)?.replace(/’/g, ' '),
        IE: nota.transpRgIe?.replace(/\D/g, ''),
        xEnder: nota.transpEndereco || null,
        xMun: removeAccents(nota.transpCidade),
        UF: nota.transpEstado ?? parameters.nfeUf,
      }
    }

    let indPres = Number(parameters.nfeIndPresenca)
    let indIntermed = null
    let finNFe = FinNFe.Normal
    let natOp = removeAccents(nota.naturezaOp)
    /* if (nota.estorno) {
      finNFe = FinNFe.Ajuste
      indPres = IndPres.NaoAplica
    } else */
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
    const cnpj = parameters.nfeCnpj.padStart(14, '0')
    const serie = String(nota.serie).padStart(3, '0')
    const numero = String(nota.numeroNota).padStart(9, '0')

    const tpEmis = 1

    let nfeId = `${cUF}${data}${cnpj}${mod}${serie}${numero}${tpEmis}${cNF}`
    nfeId = `NFe${nfeId}${getVerifyingDigit(nfeId)}`
    nota.chave = nfeId

    const documentName = nota.cpfCnpj.length < 14 ? 'CPF' : 'CNPJ'
    const customercpfCnpj =
      nota.cpfCnpj.length < 14
        ? String(Number(nota.cpfCnpj)).padStart(11, '0')
        : String(Number(nota.cpfCnpj)).padStart(14, '0')
    const customerName = parameters.nfeHomologation
      ? 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
      : removeAccents(nota.razaoSocial)
          .replace(/’/g, ' ')
          .replace(/–/g, ' ')
          .replace(/•/g, ' ')
          .replace(/“/g, ' ')
          .replace(/”/g, ' ')
          .replace(/—/g, ' ')
          .trim()
    const customerEnd = removeAccents(nota.endereco)
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

    const customerBairro = removeAccents(nota.bairro)
      .replace(/'/g, ' ')
      .replace(/’/g, ' ')
      .replace(/–/g, ' ')
      .replace(/•/g, ' ')
      .replace(/“/g, ' ')
      .replace(/”/g, ' ')
      .replace(/—/g, ' ')
      .trim()
    const customerCityCode = isExternal ? 9999999 : getCityCode(nota.cidade, stateCode[nota.estado])
    const customerCity = isExternal ? 'Exterior' : removeAccents(nota.cidade)

    const customerCountry = isExternal ? nota.descCountry : 'Brasil'

    let tPag = '90'
    let xPag = null
    let vPag = '0.00'

    if (!nota.estorno && !isDevolution && !nota.complementar) {
      if (nota.totalDinheiro > 0) {
        tPag = '01'
        vPag = nota.totalDinheiro.toFixed(2)
      } else if (nota.totalCheque > 0) {
        tPag = '02'
        vPag = nota.totalCheque.toFixed(2)
      } else if (nota.totalCartaoCredito > 0) {
        tPag = '03'
        vPag = nota.totalCartaoCredito.toFixed(2)
      } else if (nota.totalCartaoDebito > 0) {
        tPag = '04'
        vPag = nota.totalCartaoDebito.toFixed(2)
      } else if (nota.totalBoleto > 0) {
        tPag = '15'
        vPag = nota.totalBoleto.toFixed(2)
      } else if (nota.totalOutros > 0) {
        tPag = '99'
        xPag = 'Mercado Pago'
        vPag = nota.totalOutros.toFixed(2)
      }
    }

    // const splittedDesc = currency(parseFloat(nota.desconto)).distribute(products.length)
    // const splittedFrete = currency(nota.frete).distribute(products.length)
    const fundoPobreza = getStateFundoPobreza(nota.estado)
    const stateAliquot = getStateAliquot(nota.estado) - fundoPobreza
    const interstateAliquot = getInterstateAliquot('SP', nota.estado)
    const diffAliquot = stateAliquot - interstateAliquot

    let totalTrib = 0
    let totalBaseIcms = 0
    let totalVlIcms = 0
    let totalProduct = 0
    let totalProductNota = 0
    let totalDesc = 0
    let totalFrete = 0
    let totalICMSUFDest = 0
    let totalFCPUFDest = 0
    let totalPis = 0
    let totalCofins = 0

    let totalitem = 0
    const det = products.map((product, i) => {
      const gTIN = product.refProdutopriceArred
      const productCfop = product.cfop ?? cfop
      const isProdAnp = productCfop.includes('.656')
      totalitem = totalitem + 1
      const quantity = nota.complementar ? product.quantidade - (product.quantidadeRef ?? 0) : product.quantidade
      const pesoproduto = !product.Peso ? 0 : product.Peso
      let priceArred = 0
      let descArred = 0
      let freteArred = 0
      const unitPrice = nota.complementar && !quantity ? 0 : product.unitario
      const price = (unitPrice * quantity).toFixed(2)
      const valorprod = unitPrice * quantity

      totalProduct = totalProduct + parseFloat(price)
      priceArred = parseFloat(price)

      if (totalProduct > parseFloat(nota.totalProduto))
        priceArred = parseFloat(price) - (totalProduct - parseFloat(nota.totalProduto))
      else if (totalitem === nota.qtdeProdutos)
        priceArred = parseFloat(price) + (parseFloat(nota.totalProduto) - totalProduct)
      const vFretes = ((priceArred * nota.frete) / parseFloat(nota.totalProduto)).toFixed(2)
      if (totalFrete === nota.frete) freteArred = 0
      else {
        totalFrete = totalFrete + parseFloat(vFretes)
        freteArred = parseFloat(vFretes)

        if (totalFrete > nota.frete) freteArred = parseFloat(vFretes) - (totalFrete - nota.frete)
        else if (totalitem === nota.qtdeProdutos) freteArred = parseFloat(vFretes) + (nota.frete - totalFrete)
      }
      const vDescs = ((priceArred * parseFloat(nota.desconto)) / parseFloat(nota.totalProduto)).toFixed(2)

      if (totalDesc === parseFloat(nota.desconto)) descArred = 0
      else {
        totalDesc = totalDesc + parseFloat(vDescs)
        descArred = parseFloat(vDescs)
        if (totalDesc > parseFloat(nota.desconto))
          descArred = parseFloat(vDescs) - (totalDesc - parseFloat(nota.desconto))
        else if (totalitem === nota.qtdeProdutos)
          descArred = parseFloat(vDescs) + (parseFloat(nota.desconto) - totalDesc)
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
      if (product.st === 0) {
        totalBaseIcms += product.baseICMS
        totalVlIcms += product.valorICMS
      } else {
        totalVlIcms += 0
        totalBaseIcms += 0
      }
      totalTrib += product.baseTributo
      totalProductNota += valorprod
      totalICMSUFDest += vICMSUFDest
      totalFCPUFDest += vFCPUFDest
      totalPis += (parseFloat(product.alqPis) / 100) * product.baseICMS
      totalCofins += (parseFloat(product.alqCofins) / 100) * product.baseICMS

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

      return removeEmpty({
        $: { nItem: i + 1 },
        prod: {
          cProd: nota.complementar ? 'CFOP 5.949' : product.cod ? product.cod : product.produto,
          cEAN: (isDevolution || nota.estorno) && infGTIN ? gTIN : 'SEM GTIN',
          xProd: nota.complementar
            ? 'NOTA FISCAL COMPLEMENTAR'
            : removeAccents(product.descricao)
                .replace(/[^\w.@-]/g, ' ')
                .trim(),
          NCM: product.ncm,
          cBenef: getCBenef(product.st),
          CFOP: productCfop.replace(/\D/g, ''),
          uCom,
          qCom: quantity.toFixed(4),
          vUnCom: unitPrice.toFixed(4),
          vProd: priceArred.toFixed(2),
          cEANTrib: (isDevolution || nota.estorno) && infGTIN ? gTIN : 'SEM GTIN',
          uTrib: isProdAnp ? 'KG' : product.uTrib && isExternal ? product.uTrib : uCom,
          qTrib: isExternal ? (pesoproduto * quantity).toFixed(4) : quantity.toFixed(4),
          vUnTrib: isExternal ? (priceArred / (pesoproduto * quantity)).toFixed(4) : unitPrice.toFixed(4),
          vFrete: freteArred && !nota.complementar ? freteArred.toFixed(2) : null,
          vDesc:
            descArred && !nota.complementar && descArred.toFixed(2) !== '0.00' && descArred > 0
              ? descArred.toFixed(2)
              : null,
          indTot: 1,
          DI,
        },

        imposto: {
          vTotTrib: product.baseTributo.toFixed(2),
          ICMS: getICMS(
            product.cf,
            product.st,
            product.baseICMS.toFixed(2),
            product.aliquotaICMS.toFixed(4),
            product.valorICMS.toFixed(2),
          ),
          PIS: {
            PISNT: product.pisCofins ? null : { CST: '06' },
            PISAliq: {
              CST: product.cstPis,
              vBC: product.baseICMS.toFixed(2),
              pPIS: parseFloat(product.alqPis),
              vPIS: ((product.alqPis / 100) * product.baseICMS).toFixed(2),
            },
          },
          COFINS: {
            COFINSNT: product.pisCofins ? null : { CST: '06' },
            COFINSAliq: {
              CST: product.cstCofins,
              vBC: product.baseICMS.toFixed(2),
              pCOFINS: parseFloat(product.alqCofins),
              vCOFINS: ((product.alqCofins / 100) * product.baseICMS).toFixed(2),
            },
          },
          ICMSUFDest:
            isOpInterstate && indIEDest === 9
              ? {
                  vBCUFDest: vBCUFDest.toFixed(2),
                  pFCPUFDest: pFCPUFDest.toFixed(2),
                  pICMSUFDest: pICMSUFDest.toFixed(2),
                  pICMSInter: interstateAliquot.toFixed(2),
                  pICMSInterPart: '100.00',
                  vFCPUFDest: vFCPUFDest.toFixed(2),
                  vICMSUFDest: vICMSUFDest.toFixed(2),
                  vICMSUFRemet: '0.00',
                }
              : null,
        },
      })
    })
    const totalNota = totalProductNota - parseFloat(nota.desconto) + nota.frete + nota.seguro + nota.outrasDespesas
    // contador da livraria pediu que essa mensagem seja para dentro ou fora estado e para cst 40 e 41
    // const naoIncidenciaPr =
    //  parameters.NFE_UF === 'PR' && products.some(product => product.st === 40)
    const naoIncidenciaPr = products.some(product => product.st === 40) || products.some(product => product.st === 41)
    let NFref = null
    if (nota.estorno || isDevolution) {
      const notasNFeRef = allRefs.filter(ref => ref.Nota === nota.codNota)
      if (notasNFeRef.length > 0) {
        const auxNFref = []
        for (const nfref of notasNFeRef) {
          auxNFref.push({ refNFe: nfref.NfeRef.replace('NFe', '') })
        }
        NFref = auxNFref
      } else {
        if (nota.NFeRef) {
          NFref = { refNFe: nota.NFeRef.replace('NFe', '') }
        }
      }
    }

    const infCpl = ''

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
      idDest: getIdDest(cfop, nota.estado, isExternal, parameters.nfeUf),
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
              CEP: parameters.nfeCep.replace(/\D/g, ''),
              cPais: 1058,
              fone: parameters.nfeFone.replace(/\D/g, ''),
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
              CEP: nota.cep.replace(/\D/g, ''),
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
              vBC: totalBaseIcms.toFixed(2),
              vICMS: totalVlIcms.toFixed(2),
              vICMSDeson: 0,
              vFCPUFDest: isOpInterstate ? totalFCPUFDest.toFixed(2) : null,
              vICMSUFDest: isOpInterstate && indIEDest === 9 ? totalICMSUFDest.toFixed(2) : null,
              vICMSUFRemet: isOpInterstate ? '0.00' : null,
              vFCP: '0.00',
              vBCST: '0.00',
              vST: '0.00',
              vFCPST: '0.00',
              vFCPSTRet: '0.00',
              vProd: totalProductNota.toFixed(2),
              vFrete: nota.frete ? nota.frete.toFixed(2) : '0.00',
              vSeg: nota.seguro ? nota.seguro.toFixed(2) : '0.00',
              vDesc: parseFloat(nota.desconto) ? parseFloat(nota.desconto).toFixed(2) : '0.00',
              vII: '0.00',
              vIPI: '0.00',
              vIPIDevol: '0.00',
              vPIS: totalPis?.toFixed(2) || 0,
              vCOFINS: totalCofins?.toFixed(2) || 0,
              vOutro: '0.00',
              vNF: nota.complementar ? '0.00' : totalNota.toFixed(2),
              vTotTrib: totalTrib.toFixed(2),
            },
          },

          transp: {
            modFrete: tipoFrete,
            transporta,
            vol: {
              qVol: nota.volumes,
              esp: nota.especie,
              pesoL: nota.pesoLiquido.toFixed(3),
              pesoB: nota.pesoBruto.toFixed(3),
            },
          },
          pag: { detPag: { tPag, xPag, vPag } },
          infAdic: {
            infCpl:
              removeAccents(infCpl)
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
            obsCont: {
              $: { xCampo: 'Obs' },
              xTexto:
                removeAccents(nota.observacoes)
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
          },
          exporta,
          // infRespTec: {
          //   CNPJ: '22540716000114',
          //   xContato: 'Suporte',
          //   email: 'suporte@expertisp.com.br',
          //   fone: '1839033930',
          // },
        },
      },
    }
  })

  const nfeItems = []
  const items = xmls.map(xmlObj => {
    const builder = new xml2js.Builder({ headless: true })
    const xml = minify(builder.buildObject(removeEmpty(xmlObj)))
    const sig = new SignedXml()

    sig.addReference("//*[local-name(.)='infNFe']", [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ])

    sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
    sig.signingKey = certPem.key
    sig.keyInfoProvider = new KeyInfo(certPem.cert, certPem.key)

    sig.computeSignature(xml, {
      location: { reference: "//*[local-name(.)='infNFe']", action: 'after' },
    })

    const signedXml = sig.getSignedXml()

    nfeItems.push([xmlObj.NFe.infNFe.$.Id.replace('NFe', ''), signedXml])

    return signedXml
  })

  const lote = `<enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    <idLote>${+new Date()}</idLote>
    <indSinc>0</indSinc>
    ${items.join('')}
  </enviNFe>`
  const [nfeId, xml] = nfeItems[0]

  const requestData = minify(
    `<?xml version="1.0" encoding="utf-8" ?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body><nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">${lote}</nfeDadosMsg></soap12:Body></soap12:Envelope>`,
  )

  try {
    if (requestData.length < 500000 && nfeItems.length > 0) {
      await nfeRepository.createNfeStorage({
        nome: nfeId + '-nfe.xml',
        conteudo: Buffer.from(xml, 'utf-8'),
        companyId: parameters.companyId,
      })
      const envioResponse = await nfeAutorizacao(requestData, !!parameters.nfeHomologation, certPem, parameters)
      // sem internet
      if (Number(envioResponse.cStat) === 500) {
        for (const nota of notas) {
          await prisma.$queryRaw`UPDATE nfe SET chave=${nota.chave} WHERE id = ${nota.id}`
        }
      }
      if (Number(envioResponse.cStat) === 103) {
        for (const nota of notas) {
          await prisma.$queryRaw`UPDATE nfe SET chave=${nota.chave}, status=${'Aguardando'}, "reciboLote"=${
            envioResponse.infRec.nRec
          } WHERE id = ${nota.id}`
        }
        await prisma.$queryRaw`INSERT INTO nfe_lote_queue(
          "statusLote", recibo, "companyId")
           VALUES (${'Aguardando'}, ${envioResponse.infRec.nRec}, ${parameters.companyId})`
        return envioResponse.infRec.nRec
      } else if (
        Number(envioResponse.cStat) !== 500 &&
        Number(envioResponse.cStat) !== 108 &&
        Number(envioResponse.cStat) !== 109
      ) {
        for (const nota of notas) {
          await prisma.$queryRaw`UPDATE nfe SET chave = ${
            nota.chave
          }, status=${'Erro'}, erros=${'envioResponse.xMotivo'} WHERE id = ${nota.id}`
        }
        logger.error('Falha no Schema XML do lote de NFe .. ' + envioResponse)
      } else {
        logger.error('Erro no Recebimento Lote ... ' + envioResponse.cStat + ' - ' + envioResponse.xMotivo)
        for (const nota of notas) {
          await prisma.$queryRaw`UPDATE nfe
          SET chave=${nota.chave}, status=${'Erro'}, erros=${
            'Contate o suporte ' + envioResponse.cStat + ' - ' + envioResponse.xMotivo
          } WHERE id = ${nota.id}`
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
  prisma.$disconnect()
}
