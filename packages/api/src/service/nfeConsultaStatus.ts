import axios from 'axios'
import https from 'https'
import pem from 'pem'
import xml2js from 'xml2js'

import { logger } from '../utils/logger'

export async function nfeConsultaStatus(xmlData: string, isDev: boolean, cert: pem.Pkcs12ReadResult) {
  const serviceUrl = isDev ? 'https://homologacao.nfe.sefa.pr.gov.br/nfe' : 'https://nfe.fazenda.sp.gov.br/ws'

  try {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false, ...cert })
    const { data } = await axios.post(`${serviceUrl}/NFeStatusServico4?wsdl`, xmlData, {
      headers: { 'Content-Type': 'text/xml' },
      httpsAgent,
    })

    const response = await xml2js.parseStringPromise(data, {
      explicitArray: false,
      explicitRoot: false,
      ignoreAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    })

    const retEnvEvento = response.Body.nfeResultMsg
    return retEnvEvento
  } catch (err) {
    logger.error('Erro evento inutilizar no Sefaz, verifique internet ')
    return { cStat: 500, xMotivo: err.message, ...err?.response?.data }
  }
}
