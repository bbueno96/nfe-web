import { format } from 'date-fns'
import { minify } from 'minify-xml'
import { SignedXml } from 'xml-crypto'
import xml2js from 'xml2js'

import { prisma } from '../../database/client'
import { Nfe } from '../../entities/Nfe'
import { Parameter } from '../../entities/Parameter'
import { NfeRepository } from '../../repositories/NfeRepository'
import { nfeCancelamento } from '../../service/nfeCancelamento'
import { readPkcs12Async } from '../../utils/readPkcs12Async'
import { removeEmpty } from '../../utils/removeEmpty'

export async function cancelNFe(nf: Nfe, parameters: Parameter) {
  const nfeRepository = new NfeRepository()
  if (nf && parameters && parameters.nfeCnpj && parameters.passwordCert && parameters.pfx) {
    const tpAmb = parameters.nfeHomologation ? 2 : 1
    const certPem = await readPkcs12Async(parameters.pfx, {
      p12Password: atob(parameters.passwordCert),
    })
    const cOrgao = parameters.nfeUfCod
    const descEvento = 'Cancelamento'
    let nProt = nf.nomeLote
    if (nf.nomeLote?.substring(0, 2) === 'S1') {
      nProt = nf.reciboLote
    } else {
      nProt = nf.nomeLote
    }

    const xJust = 'Dados incorretos'

    const chNFe = nf.chave?.replace('NFe', '')
    const CNPJ = parameters.nfeCnpj?.padStart(14, '0')

    const eventoId = `ID110111${chNFe}01`

    const detEvento = {
      $: { versao: '1.00' },
      descEvento,
      nProt,
      xJust,
    }

    const dataAtual = new Date()

    const xmls = {
      evento: {
        $: { versao: '1.00' },
        infEvento: {
          $: { Id: eventoId, xmlns: 'http://www.portalfiscal.inf.br/nfe' },
          cOrgao,
          tpAmb,
          CNPJ,
          chNFe,
          dhEvento: format(dataAtual, "yyyy-MM-dd'T'HH:mm:ssxxx"),
          tpEvento: 110111,
          nSeqEvento: 1,
          verEvento: '1.00',
          detEvento,
        },
      },
    }

    const builder = new xml2js.Builder({ headless: true })
    const xml = minify(builder.buildObject(removeEmpty(xmls)))
    const sig = new SignedXml({
      privateKey: certPem.key,
      publicCert: certPem.cert,
      canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    })

    sig.addReference({
      xpath: "//*[local-name(.)='infEvento']",
      transforms: [
        'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      ],
    })
    sig.computeSignature(xml, {
      location: { reference: "//*[local-name(.)='infEvento']", action: 'after' },
    })

    const nfeXml = sig.getSignedXml()
    const nfeId = xmls.evento.infEvento.chNFe

    const lote = `<envEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00"><idLote>${+new Date()}</idLote>${nfeXml}</envEvento>`
    const requestData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body><nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4">${lote}</nfeDadosMsg></soap12:Body></soap12:Envelope>`

    const envioResponse = await nfeCancelamento(requestData, !!parameters.nfeHomologation, certPem, parameters)
    if (Number(envioResponse.cStat) === 128) {
      await nfeRepository.createNfeStorage({
        nome: nfeId + '-canc.xml',
        conteudo: Buffer.from(nfeXml, 'utf-8'),
        companyId: parameters.companyId,
      })

      const items = Array.isArray(envioResponse.retEvento) ? envioResponse.retEvento : [envioResponse.retEvento]

      for (const item of items) {
        const data = item.infEvento

        if (Number(data.cStat) === 135 || Number(data.cStat) === 573) {
          await prisma.$queryRaw`UPDATE nfe SET status='Cancelado',"emailEnviado"=${false} WHERE chave=${`NFe${data.chNFe}`}`
          const builder = new xml2js.Builder({ headless: true })
          await nfeRepository.createNfeStorage({
            nome: data.chNFe + '-protcanc.xml',
            conteudo: Buffer.from(builder.buildObject(item), 'utf-8'),
            companyId: parameters.companyId,
          })
          return true
        } else {
          await prisma.$queryRaw`UPDATE nfe SET status='Autorizado',"emailEnviado"=${false}, erros =${
            data.xMotivo
          } WHERE chave=${`NFe${data.chNFe}`}`
        }
      }
    } else if (Number(envioResponse.cStat) !== 500) {
      await prisma.$queryRaw`UPDATE nfe SET status='Autorizado',"emailEnviado"=${false}, erros =${
        envioResponse.xMotivo
      } WHERE chave=${`NFe${nf?.id}`}`
    }
    return false
  }
}
