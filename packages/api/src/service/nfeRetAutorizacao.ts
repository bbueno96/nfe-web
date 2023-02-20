import axios from 'axios'
import https from 'https'
import pem from 'pem'
import xml2js from 'xml2js'

import { logger } from '../utils/logger'

export async function nfeRetAutorizacao(xmlData: string, isDev: boolean, cert: pem.Pkcs12ReadResult) {
  const serviceUrl = isDev ? 'https://homologacao.nfe.fazenda.sp.gov.br/ws' : 'https://nfe.fazenda.sp.gov.br/ws'

  try {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false, ...cert })
    const { data } = await axios.post(`${serviceUrl}/nferetautorizacao4.asmx`, xmlData, {
      headers: { 'Content-Type': 'text/xml' },
      httpsAgent,
    })

    const response = await xml2js.parseStringPromise(data, {
      explicitArray: false,
      explicitRoot: false,
      ignoreAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    })

    const { retConsReciNFe } = response.Body.nfeResultMsg
    return retConsReciNFe
  } catch (err) {
    // console.log(err)
    logger.error('Erro retorno da Autorização Sefaz, verifique a internet ')
    return { cStat: 500, xMotivo: err.message, ...err?.response?.data }
  }
}
