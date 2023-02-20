import { Readable } from 'stream'

import { NfeRepository } from '../../repositories/NfeRepository'
import { ApiError } from '../../utils/ApiError'
import { gerarDanfe } from '../../utils/webDanfe'
export class GetNfePdfUseCase {
  constructor(private nfeRepository: NfeRepository) {}
  gerarDanfeAsync(xml: string): Promise<string> {
    return new Promise((resolve, reject) => {
      gerarDanfe(xml, (err, pdf) => {
        if (err) {
          reject(err)
        }
        resolve(pdf)
      })
    })
  }

  bufferToStream(buffer) {
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    return stream
  }

  async execute(id: string) {
    const nota = await this.nfeRepository.findById(id)
    if (!nota) {
      throw new ApiError('Nota não encontrada.', 404)
    }
    let chave = ''
    if (nota.status === 'Autorizado') {
      chave = nota.chave.replace('NFe', '') + '-nfe.xml'
    } else if (nota.status === 'Cancelado') {
      chave = nota.chave.replace('NFe', '') + '-canc.xml'
    }
    const xmlNota = await this.nfeRepository.getXmlNota(chave)

    let chaveNotaret = ''
    if (xmlNota != null) {
      if (nota.status === 'Cancelado') {
        chaveNotaret = nota.chave.replace('NFe', '') + '-protcanc.xml'
      } else {
        if (nota.statuscartaCorrecao == null) {
          chaveNotaret = nota.chave.replace('NFe', '') + '-prot.xml'
        } else chaveNotaret = nota.chave.replace('NFe', '') + '-protccor.xml'
      }
      const xmlNotaRet = await this.nfeRepository.getXmlNota(chaveNotaret)

      const xmlDanfe = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
      ${Buffer.from(xmlNota.conteudo || '', 'utf-8')}
      <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
      ${Buffer.from(xmlNotaRet.conteudo || '', 'utf-8')}
      </protNFe>
      </nfeProc>`
      const danfeData = Buffer.from(await this.gerarDanfeAsync(xmlDanfe), 'binary')
      if (!Buffer.isBuffer(danfeData)) {
        throw new ApiError('Nota não Autorizada.', 404)
      }
      return Readable.from(danfeData)
    }
  }
}
