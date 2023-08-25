import axios from 'axios'
import https from 'https'
import pem from 'pem'
import xml2js from 'xml2js'

import { Parameter } from '../entities/Parameter'
import { logger } from '../utils/logger'

export async function nfeAutorizacao(
  xmlData: string,
  isDev: boolean,
  cert: pem.Pkcs12ReadResult,
  parameters: Parameter,
) {
  const serviceUrl = isDev ? 'https://homologacao.nfe.fazenda.sp.gov.br/ws' : 'https://nfe.fazenda.sp.gov.br/ws'

  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      pfx: parameters.pfx ? parameters.pfx : '',
      passphrase: atob(parameters.passwordCert ? parameters.passwordCert : ''),
    })
    const { data } = await axios.post(`${serviceUrl}/nfeautorizacao4.asmx`, xmlData, {
      headers: { 'Content-Type': 'text/xml' },
      httpsAgent,
    })

    const response = await xml2js.parseStringPromise(data, {
      explicitArray: false,
      explicitRoot: false,
      ignoreAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    })
    const { retEnviNFe } = response.Body.nfeResultMsg
    return retEnviNFe
  } catch (err) {
    logger.error('Erro evento Autorização Sefaz. Verifique a internet! ', err)
    return { cStat: 500, xMotivo: err.message, ...err?.response?.data }
  }
}
