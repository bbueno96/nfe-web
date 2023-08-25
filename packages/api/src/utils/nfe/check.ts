import xml2js from 'xml2js'

import { logger } from '@sentry/utils'

import { prisma } from '../../database/client'
import { Nfe } from '../../entities/Nfe'
import { Parameter } from '../../entities/Parameter'
import { NfeRepository } from '../../repositories/NfeRepository'
import { nfeRetAutorizacao } from '../../service/nfeRetAutorizacao'
import { readPkcs12Async } from '../../utils/readPkcs12Async'
import { sendEmail } from './email'

export async function check(recibo: string, parameter: Parameter) {
  if (recibo && parameter && parameter.nfeCnpj && parameter.passwordCert && parameter.pfx) {
    const nfeRepository = new NfeRepository()
    const tpAmb = parameter.nfeHomologation ? 2 : 1
    const certPem = await readPkcs12Async(parameter.pfx, {
      p12Password: atob(parameter.passwordCert),
    })
    const requestData = `<?xml version="1.0" encoding="UTF-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body><nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeRetAutorizacao4"><consReciNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><tpAmb>${tpAmb}</tpAmb><nRec>${recibo}</nRec></consReciNFe></nfeDadosMsg></soap12:Body></soap12:Envelope>`
    const checkResponse = await nfeRetAutorizacao(requestData, !!parameter.nfeHomologation, certPem)
    try {
      if (Number(checkResponse.cStat) === 104) {
        const items = checkResponse.protNFe

        const data = items.infProt

        if (Number(data.cStat) === 100) {
          const builder = new xml2js.Builder({ headless: true })
          await nfeRepository.createNfeStorage({
            nome: data.chNFe + '-prot.xml',
            conteudo: Buffer.from(builder.buildObject(items), 'utf-8'),
            companyId: parameter.companyId,
          })
          await prisma.$queryRaw`UPDATE nfe SET status=${'Autorizado'}, erros=${''},"nomeLote"=${
            data.nProt
          }, "dataAutorizacao"=${new Date(data.dhRecbto)} WHERE chave=${'NFe' + data.chNFe}`
          const nf = await prisma.$queryRaw<Nfe>` SELECT * FROM nfe WHERE chave=${'NFe' + data.chNFe}`
          await sendEmail(nf[0].id, parameter)
          return {
            xMotivo: data.xMotivo,
            reciboLote: checkResponse.nRec,
            dhRecbto: data.dhRecbto,
            chNFe: data.chNFe,
            auth: true,
          }
        } else if (Number(data.cStat) === 303 || Number(data.cStat) === 301 || Number(data.cStat) === 302) {
          const builder = new xml2js.Builder({ headless: true })

          await nfeRepository.createNfeStorage({
            nome: data.chNFe + '-prot.xml',
            conteudo: Buffer.from(builder.buildObject(items), 'utf-8'),
            companyId: parameter.companyId,
          })
          await prisma.$queryRaw`UPDATE nfe SET status=${'Denegado'}, erros=${data.xMotivo},"nomeLote"=${
            data.nProt
          } WHERE chave=${'NFe' + data.chNFe}`
          return {
            xMotivo: data.xMotivo,
            reciboLote: checkResponse.nRec,
            dhRecbto: checkResponse.dhRecbto,
            auth: false,
          }
        } else {
          await prisma.$queryRaw`UPDATE nfe SET status=${'Erro'}, erros=${data.xMotivo},"nomeLote"=${
            data.nProt
          } WHERE chave=${'NFe' + data.chNFe}`
          return {
            xMotivo: checkResponse.xMotivo,
            reciboLote: checkResponse.nRec,
            dhRecbto: checkResponse.dhRecbto,
            auth: false,
          }
        }
      } else if (Number(checkResponse.cStat) === 105) {
        await prisma.$queryRaw`UPDATE nfe SET status=${'Lote em Processamento'} WHERE "reciboLote"=${
          checkResponse.nRec
        }`
        return { xMotivo: checkResponse.xMotivo, reciboLote: checkResponse.nRec, dhRecbto: checkResponse.dhRecbto }
      } else if (Number(checkResponse.cStat) === 106) {
        await prisma.$queryRaw`UPDATE nfe SET status=${'Erro'}, erros=${checkResponse.xMotivo} WHERE "reciboLote"=${
          checkResponse.nRec
        }`
        return { xMotivo: checkResponse.xMotivo, reciboLote: checkResponse.nRec, dhRecbto: checkResponse.dhRecbto }
      } else {
        await prisma.$queryRaw`UPDATE nfe SET status=${'Erro'}, erros=${checkResponse.xMotivo} WHERE "reciboLote"=${
          checkResponse.nRec
        }`
        return { xMotivo: checkResponse.xMotivo, reciboLote: checkResponse.nRec, dhRecbto: checkResponse.dhRecbto }
      }
    } catch (err) {
      logger.error('Erro atualizar status aguardando para autorizado ou erro', err)
      console.log(err)
    }
  }
}
