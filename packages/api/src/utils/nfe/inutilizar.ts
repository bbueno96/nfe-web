import { format } from 'date-fns'
import { minify } from 'minify-xml'
import { SignedXml } from 'xml-crypto'
import xml2js from 'xml2js'

import { prisma } from '../../database/client'
import { Nfe } from '../../entities/Nfe'
import { Parameter } from '../../entities/Parameter'
import { stateCode } from '../../ibge/state'
import { NfeRepository } from '../../repositories/NfeRepository'
import { nfeInutilizacao } from '../../service/nfeInutilizacao'
import { readPkcs12Async } from '../../utils/readPkcs12Async'
import { removeEmpty } from '../../utils/removeEmpty'

export async function inutilizarNFe(nf: Nfe, parameters: Parameter) {
  if (nf && parameters && parameters.nfeCnpj && parameters.passwordCert && parameters.pfx) {
    const nfeRepository = new NfeRepository()
    const tpAmb = parameters.nfeHomologation ? 2 : 1
    const certPem = await readPkcs12Async(parameters.pfx, {
      p12Password: atob(parameters.passwordCert),
    })
    const xServ = 'INUTILIZAR'
    const xJust = 'Numeracao pulou por ter sido recusada'
    const mod = 55
    const ano = format(nf.data, 'yy')
    const nserie = String(nf.serie).padStart(3, '0')
    const serie = nf.serie
    const nNFIni = nf.numeroNota
    const nNFFin = nf.numeroNota
    const numero = String(nf.numeroNota).padStart(9, '0')
    const CNPJ = parameters.nfeCnpj.padStart(14, '0')
    const cUF = stateCode[parameters.nfeUf || 'SP']
    const eventoId = `ID${cUF}${ano}${CNPJ}${mod}${nserie}${numero}${numero}`

    const dados = {
      infInut: {
        $: { Id: eventoId, xmlns: 'http://www.portalfiscal.inf.br/nfe' },
        tpAmb,
        xServ,
        cUF,
        ano,
        CNPJ,
        mod,
        serie,
        nNFIni,
        nNFFin,
        xJust,
      },
    }

    const builder = new xml2js.Builder({ headless: true })
    const xml = minify(builder.buildObject(removeEmpty(dados)))
    const sig = new SignedXml({
      privateKey: certPem.key,
      publicCert: certPem.cert,
      canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    })

    sig.addReference({
      xpath: "//*[local-name(.)='infInut']",
      transforms: [
        'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      ],
    })
    sig.computeSignature(xml)

    const signatureXml = sig.getSignatureXml()
    const signedXml = `${xml}${signatureXml}`

    const lote = `<inutNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">${signedXml}</inutNFe>`
    const requestData = `<?xml version="1.0" encoding="utf-8" ?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Header /><soap12:Body><nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4">${lote}</nfeDadosMsg></soap12:Body></soap12:Envelope>`
    const envioResponse = await nfeInutilizacao(requestData, !!parameters.nfeHomologation, certPem, parameters)

    if (envioResponse.retInutNFe) {
      if (
        Number(envioResponse.retInutNFe.infInut.cStat) === 102 ||
        Number(envioResponse.retInutNFe.infInut.cStat) === 206 ||
        Number(envioResponse.retInutNFe.infInut.cStat) === 563
      ) {
        await prisma.$queryRaw`UPDATE nfe SET status='Inutilizado' WHERE id = ${nf.id}`
        const builder = new xml2js.Builder({ headless: true })
        await nfeRepository.createNfeStorage({
          nome: nf.numeroNota + '-protinutil.xml',
          conteudo: Buffer.from(builder.buildObject(signedXml), 'utf-8'),
          companyId: parameters.companyId,
        })
      } else {
        await prisma.$queryRaw`UPDATE nfe SET status='Erro', erros =${envioResponse.retInutNFe.infInut.xMotivo} WHERE id = ${nf.id}`
      }
      return envioResponse.retInutNFe.infInut.xMotivo
    } else if (Number(envioResponse.cStat) !== 500) {
      await prisma.$queryRaw`UPDATE nfe SET status='Erro', erros =${envioResponse.xMotivo} WHERE id = ${nf.id}`
      return envioResponse.xMotivo
    }

    return 'Erro ao inutilizar'
  }
}
