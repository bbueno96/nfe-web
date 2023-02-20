import axios from 'axios'
import https from 'https'
import pem from 'pem'
import xml2js from 'xml2js'

import { logger } from '../utils/logger'

export async function nfeInutilizacao(
  xmlData: string,
  isDev: boolean,
  cert: pem.Pkcs12ReadResult,
  ufEmit: string,
  parameters: any,
) {
  const serviceUrl = isDev ? `https://homologacao.nfe.fazenda.${ufEmit}.gov.br/ws` : 'https://nfe.fazenda.sp.gov.br/ws'

  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      pfx: parameters.pfx,
      passphrase: atob(parameters.passwordCert),
      // ...cert,
    })
    const { data } = await axios.post(`${serviceUrl}/nfeinutilizacao4.asmx`, xmlData, {
      headers: { 'Content-Type': 'text/xml;charset=utf-8', SOAPAction: 'ACTION' },
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
    console.log(err)
    logger.error('Erro evento inutilizar no Sefaz, verifique internet ')
    return { cStat: 500, xMotivo: err.message, ...err?.response?.data }
  }
}
