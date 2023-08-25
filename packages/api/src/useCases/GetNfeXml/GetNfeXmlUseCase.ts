import { Readable } from 'stream'

import { NfeRepository } from '../../repositories/NfeRepository'
import { ApiError } from '../../utils/ApiError'
import { gerarDanfe } from '../../utils/webDanfe'
export class GetNfeXmlUseCase {
  constructor(private nfeRepository: NfeRepository) {}
  gerarDanfeAsync(xml: string): Promise<string> {
    return new Promise((resolve, reject) => {
      gerarDanfe(xml, (err, xml) => {
        if (err) {
          reject(err)
        }
        resolve(xml)
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
    if (nota && nota.chave) {
      let chave = ''
      if (nota.status === 'Cancelado') {
        chave = nota.chave.replace('NFe', '') + '-canc.xml'
      } else {
        chave = nota.chave.replace('NFe', '') + '-nfe.xml'
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
        let xmlNotaRet
        if (chaveNotaret !== '') xmlNotaRet = await this.nfeRepository.getXmlNota(chaveNotaret)
        let xmlDanfe
        if (xmlNotaRet) {
          xmlDanfe = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
      ${xmlNota.conteudo?.toString('utf-8')}
      <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
      ${xmlNotaRet.conteudo?.toString('utf-8')}
      </protNFe>
      </nfeProc>`
        } else {
          xmlDanfe = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
      ${xmlNota.conteudo?.toString('utf-8')}
      </nfeProc>`
        }
        const danfeData = Buffer.from(await xmlDanfe, 'binary')

        return Readable.from(danfeData)
      }
    } else {
      throw new ApiError('Nota não encontrada.', 404)
    }
  }
}
