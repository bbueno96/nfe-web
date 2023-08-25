import JSZip from 'jszip'

import { NfeRepository } from '../../repositories/NfeRepository'
import { IListXmlNfeFilters } from './ListXmlNfeDTO'

export class ListXmlNfeUseCase {
  constructor(private nfeRepository: NfeRepository) {}

  async execute(filters: IListXmlNfeFilters) {
    const data = await this.nfeRepository.list(filters)

    if (!data.items.length) {
      return null
    }

    const zip = new JSZip()

    for (const nota of data.items) {
      if (nota.chave) {
        let chave = ''

        if (nota.status === 'Cancelado') {
          chave = nota.chave.replace('NFe', '') + '-canc.xml'
        } else {
          chave = nota.chave.replace('NFe', '') + '-nfe.xml'
        }

        const xmlNota = await this.nfeRepository.getXmlNota(chave)

        let chaveNotaret = ''
        if (xmlNota && xmlNota.conteudo) {
          if (nota.status === 'Cancelado') {
            chaveNotaret = nota.chave.replace('NFe', '') + '-protcanc.xml'
          } else {
            if (nota.statuscartaCorrecao == null) {
              chaveNotaret = nota.chave.replace('NFe', '') + '-prot.xml'
            } else chaveNotaret = nota.chave.replace('NFe', '') + '-protccor.xml'
          }

          let xmlNotaRet
          if (chaveNotaret !== '') xmlNotaRet = await this.nfeRepository.getXmlNota(chaveNotaret)
          let xml
          if (xmlNotaRet) {
            xml = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
        ${xmlNota.conteudo?.toString('utf-8')}
        <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
        ${xmlNotaRet.conteudo?.toString('utf-8')}
        </protNFe>
        </nfeProc>`
          } else {
            xml = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
        ${xmlNota.conteudo?.toString('utf-8')}
        </nfeProc>`
          }

          zip.file(`${nota.chave}.xml`, xml)
        }
      }
    }

    if (!Object.keys(zip.files)) {
      return null
    }

    return zip.generateAsync({ type: 'nodebuffer' })
  }
}
