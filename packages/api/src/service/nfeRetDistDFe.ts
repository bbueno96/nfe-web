import axios from 'axios'
import https from 'https'
import pem from 'pem'
import xml2js from 'xml2js'

import { logger } from '../utils/logger'

export async function nfeRetDistDFe(xmlData: string, isDev: boolean, cert: pem.Pkcs12ReadResult) {
  /* const serviceUrl = isDev
    ? 'https://homologacao.nfe.sefa.pr.gov.br/nfe'
    : 'https://nfe.sefa.pr.gov.br/nfe'

  try {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false, ...cert })
    const { data } = await axios.post(`${serviceUrl}/NFeRetAutorizacao4?wsdl`, xmlData, {
      headers: { 'Content-Type': 'text/xml' },
      httpsAgent,
    }) */
  const serviceUrl = isDev
    ? 'https://hom1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx'
    : 'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx'

  try {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false, ...cert })
    const { data } = await axios.post(`${serviceUrl}`, xmlData, {
      headers: { 'Content-Type': 'text/xml' },
      httpsAgent,
    })

    const response = await xml2js.parseStringPromise(data, {
      explicitArray: false,
      explicitRoot: false,
      ignoreAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    })

    const { nfeDistDFeInteresseResult } = response.Body.nfeDistDFeInteresseResponse
    return nfeDistDFeInteresseResult
  } catch (err) {
    logger.error('Erro retorno Distribuicao DFe, verifique a internet ')
    return { cStat: 500, xMotivo: err.message, ...err?.response?.data }
  }
}
