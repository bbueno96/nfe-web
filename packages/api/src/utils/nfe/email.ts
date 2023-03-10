import nodemailer from 'nodemailer'

import { prisma } from '../../database/client'
import { Parameter } from '../../entities/Parameter'
import { NfeRepository } from '../../repositories/NfeRepository'
import { logger } from '../../utils/logger'
import { gerarDanfe } from '../../utils/webDanfe'
interface NFeEmail {
  id: string
  chave: string
  Email: string
  Status: string
  serie: number
  numeroNota: number
  razaoSocial: string
  totalNota: number
  cartaCorrecao: string
  statuscartaCorrecao: string
  EmailTransp: string
}
function gerarDanfeAsync(xml: string): Promise<string> {
  return new Promise((resolve, reject) => {
    gerarDanfe(xml, (err, pdf) => {
      if (err) {
        reject(err)
      }
      // fs.writeFileSync('danfe.pdf', pdf, {
      //  encoding: 'binary',
      // })
      resolve(pdf)
    })
  })
}
export async function sendEmail(nota: string, parameter: Parameter) {
  const nfeRepository = new NfeRepository()
  try {
    const nfArray =
      await prisma.$queryRaw<NFeEmail>`SELECT nfe.id, chave, serie, "numeroNota",nfe.status as "Status",customer.email as "Email",  nfe."razaoSocial", "totalNota","cartaCorrecao", nfe."statuscartaCorrecao", transportador.email as "EmailTransp" FROM nfe
  INNER JOIN customer ON customer.id = nfe.cliente
  LEFT JOIN transportador ON transportador.id = nfe.transportador
  WHERE nfe.id =${nota}`
    const nf = nfArray[0]

    const remetente = nodemailer.createTransport({
      host: parameter.emailHost,
      port: parameter.emailPort,
      secure: false,
      auth: {
        user: parameter.emailUsername,
        pass: parameter.emailPassword,
      },
    })
    const corpoEmail = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title></title>
        </head>
        <body>
            <p>
                <b>Prezado(a) ${nf?.razaoSocial || ''},</b>
            </p>
            <p>
                Voc?? est?? recebendo a Nota Fiscal Eletr??nica n??mero ${nf.numeroNota}, s??rie ${nf.serie} de ${
      parameter.nfeFantasia
    },
                no valor de R$ ${nf.totalNota}. Junto com a mercadoria, voc?? receber?? tamb??m um DANFE (Documento
                Auxiliar da Nota Fiscal Eletr??nica), que acompanha o tr??nsito das mercadorias.
            </p>
            <p>
                <i>A Nota Fiscal Eletr??nica ?? um documento de exist??ncia apenas digital, emitido e armazenado
                    eletronicamente, com o intuito de documentar, para fins fiscais, uma opera????o de
                    circula????o de mercadorias ocorrida entre as partes. Sua validade jur??dica, autoria
                    e integridade ?? garantida pela assinatura digital do remetente e pela recep????o pelo
                    Fisco do documento eletr??nico antes da ocorr??ncia do Fato Gerador. </i>
            </p>
            <p>
                <i>Os registros fiscais e cont??beis devem ser feitos, a partir do pr??prio arquivo da
                    NF-e, anexo neste e-mail, ou utilizando o DANFE, que representa graficamente a Nota
                    Fiscal Eletr??nica. A validade e autenticidade deste documento eletr??nico pode ser
                    verificada no site nacional do projeto (<a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                        www.nfe.fazenda.gov.br</a>), atrav??s da chave de acesso contida no DANFE.</i>
            </p>
            <p>
                <i>Para poder utilizar os dados descritos do DANFE na escritura????o da NF-e, tanto o
                    contribuinte destinat??rio, como o contribuinte emitente, ter??o de verificar a validade
                    da NF-e. Esta validade est?? vinculada ?? efetiva exist??ncia da NF-e nos arquivos
                    da SEFAZ, e comprovada atrav??s da emiss??o da Autoriza????o de Uso. </i>
            </p>
            <p>
                <b>O DANFE n??o ?? uma nota fiscal, nem substitui uma nota fiscal, servindo apenas como
                    instrumento auxiliar para consulta da NF-e no Ambiente Nacional. </b>
            </p>
            <p>
                Para mais detalhes sobre o projeto, consulte: <a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                    www.nfe.fazenda.gov.br</a>
            </p>
            <p>
                Para vizualizar o DANFE anexado ?? nescess??rio possuir um leitor de PDF instalado.
                Se voc?? ainda n??o o possui, pode baixar em <a href='http://get.adobe.com/br/reader/'>
                    get.adobe.com/br/reader/</a>
            </p>
            <p>
                Para vizualizar o arquivo XML anexado use o Visualizador NFeCTe50b ou maior, que
                pode ser obtido na se????o Download, Visualizador de NFe em <a href='http://www.nfe.fazenda.gov.br/portal/visualizador.aspx'>
                    www.nfe.fazenda.gov.br/portal/</a>
            </p>
            <p />
            <p>
                Atenciosamente,
            </p>
            <p>
                     ${parameter.nfeFantasia}
            </p>
            <p />
            <p />
            <hr />
            <p>
                <small>Powered by Expert Softwares e Consultoria</small>
            </p>
        </body>
        </html>`
    // #endregion
    // #region
    const corpoEmailCancel = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title></title>
        </head>
        <body>
            <p>
                <b>Prezado(a) ${nf.razaoSocial},</b>
            </p>
            <p>
                Voc?? est?? recebendo o <b>cancelamento</b> da Nota Fiscal Eletr??nica n??mero ${nf.numeroNota}, s??rie ${nf.serie} de ${parameter.nfeFantasia},
                no valor de R$ ${nf.totalNota}.
            </p>
            <p>
                <i>A Nota Fiscal Eletr??nica ?? um documento de exist??ncia apenas digital, emitido e armazenado
                    eletronicamente, com o intuito de documentar, para fins fiscais, uma opera????o de
                    circula????o de mercadorias ocorrida entre as partes. Sua validade jur??dica, autoria
                    e integridade ?? garantida pela assinatura digital do remetente e pela recep????o pelo
                    Fisco do documento eletr??nico antes da ocorr??ncia do Fato Gerador. </i>
            </p>
            <p>
                <i>Os registros fiscais e cont??beis devem ser feitos, a partir do pr??prio arquivo da
                    NF-e, anexo neste e-mail, ou utilizando o DANFE, que representa graficamente a Nota
                    Fiscal Eletr??nica. A validade e autenticidade deste documento eletr??nico pode ser
                    verificada no site nacional do projeto (<a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                        www.nfe.fazenda.gov.br</a>), atrav??s da chave de acesso contida no DANFE.</i>
            </p>
            <p>
                Para mais detalhes sobre o projeto, consulte: <a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                    www.nfe.fazenda.gov.br</a>
            </p>
            <p>
                Para vizualizar o arquivo XML anexado use o Visualizador NFeCTe50b ou maior, que
                pode ser obtido na se????o Download, Visualizador de NFe em <a href='http://www.nfe.fazenda.gov.br/portal/visualizador.aspx'>
                    www.nfe.fazenda.gov.br/portal/</a>
            </p>
            <p />
            <p>
                Atenciosamente,
            </p>
            <p>
                  ${parameter.nfeFantasia}
            </p>
            <p />
            <p />
            <hr />
            <p>
                <small>Powered by Expert Softwares e Consultoria</small>
            </p>
        </body>
        </html>`
    // #endregion
    // #region
    const corpoEmailCC = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title></title>
        </head>
        <body>
            <p>
                <b>Prezado(a) ${nf.razaoSocial},</b>
            </p>
            <p>
                Voc?? est?? recebendo a <b>Carta de Corre????o Eletr??nica</b> da Nota Fiscal Eletr??nica n??mero ${
                  nf.numeroNota
                }, s??rie ${nf.serie} de ${parameter.nfeFantasia},
                no valor de R$ ${nf.totalNota}.
            </p>
            <p>
                Texto da Carta de Corre????o: ${nf.cartaCorrecao}
            </p>
            <p>
                <i>A Carta de Corre????o ?? disciplinada pelo ?? 1??-A do art. 7?? do Conv??nio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regulariza????o de erro ocorrido na emiss??o de documento fiscal, desde que o erro n??o esteja relacionado com: I - as vari??veis que determinam o valor do imposto tais como: base de c??lculo, al??quota, diferen??a de pre??o, quantidade, valor da opera????o ou da presta????o; II - a corre????o de dados cadastrais que implique mudan??a do remetente ou do destinat??rio; III - a data de emiss??o ou de sa??da. </i>
            </p>
            <p>
                <i>A validade e autenticidade deste documento eletr??nico pode ser
                    verificada no site nacional do projeto (<a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                        www.nfe.fazenda.gov.br</a>), atrav??s da chave de acesso contida no DANFE ${nf.chave.replace(
                          'NFe',
                          '',
                        )}.</i>
            </p>
            <p>
                Para mais detalhes sobre o projeto, consulte: <a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                    www.nfe.fazenda.gov.br</a>
            </p>
            <p>
                Para vizualizar o arquivo XML anexado use o Visualizador NFeCTe50b ou maior, que
                pode ser obtido na se????o Download, Visualizador de NFe em <a href='http://www.nfe.fazenda.gov.br/portal/visualizador.aspx'>
                    www.nfe.fazenda.gov.br/portal/</a>
            </p>
            <p />
            <p>
                Atenciosamente,
            </p>
            <p>
                  ${parameter.nfeFantasia}
            </p>
            <p />
            <p />
            <hr />
            <p>
                <small>Powered by Expert Softwares e Consultoria</small>
            </p>
        </body>
        </html>`
    // #endregion
    let corpo = ''
    if (nf.Status === 'Cancelado') {
      corpo = corpoEmailCancel
    } else {
      if (nf.statuscartaCorrecao == null) corpo = corpoEmail
      else corpo = corpoEmailCC
    }
    let anexos = {}
    let anexosdanfe = {}
    let emailASerEnviado = {}
    let chaveNota = ''
    let chaveNotaret = ''
    let anexoXml = ''
    let nomeArq = ''
    let titulo = ''
    let copiaemail = ''
    if (nf.Status === 'Cancelado') {
      chaveNota = nf.chave.replace('NFe', '') + '-canc.xml'
      copiaemail = parameter.emailCopyEmail
    } else {
      if (nf.statuscartaCorrecao == null) {
        chaveNota = nf.chave.replace('NFe', '') + '-nfe.xml'
        if (!nf.EmailTransp) copiaemail = parameter.emailCopyEmail
        else if (parameter.emailCopyEmail === '') copiaemail = nf.EmailTransp
        else copiaemail = parameter.emailCopyEmail + ',' + nf.EmailTransp
      } else {
        chaveNota = nf.chave.replace('NFe', '') + '-ccorrecao.xml'
        copiaemail = parameter.emailCopyEmail
      }
    }
    const xmlNota = await nfeRepository.getXmlNota(chaveNota)

    if (xmlNota != null) {
      if (nf.Status === 'Cancelado') {
        chaveNotaret = nf.chave.replace('NFe', '') + '-protcanc.xml'
      } else {
        if (nf.statuscartaCorrecao == null) {
          chaveNotaret = nf.chave.replace('NFe', '') + '-prot.xml'
        } else chaveNotaret = nf.chave.replace('NFe', '') + '-protccor.xml'
      }
      const xmlNotaret = await nfeRepository.getXmlNota(chaveNotaret)

      if (xmlNotaret != null) {
        if (nf.Status === 'Cancelado') {
          anexoXml = `<procEventoNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
              ${Buffer.from(xmlNota.conteudo, 'utf-8')}
              <retEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
              ${Buffer.from(xmlNotaret.conteudo, 'utf-8')}
              </retEvento>
              </procEventoNFe>`
          nomeArq = nf.chave.replace('NFe', '') + '-procCanNFe.xml'
          titulo = 'Cancelamento Nota Fiscal Eletr??nica N??mero ' + nf.numeroNota + ' S??rie ' + nf.serie
          anexos = {
            filename: nomeArq,
            content: Buffer.from(anexoXml, 'utf-8'),
          }
          emailASerEnviado = {
            from: {
              name: parameter.nfeFantasia,
              address: parameter.emailUsername,
            },
            to: nf.Email,
            cc: copiaemail,
            subject: titulo,
            html: corpo,
            attachments: [anexos],
          }
        } else {
          if (nf.statuscartaCorrecao == null) {
            anexoXml = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
              ${Buffer.from(xmlNota.conteudo, 'utf-8')}
              <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
              ${Buffer.from(xmlNotaret.conteudo, 'utf-8')}
              </protNFe>
              </nfeProc>`
            titulo = 'Nota Fiscal Eletr??nica N??mero ' + nf.numeroNota + ' S??rie ' + nf.serie
            const danfeData = await gerarDanfeAsync(anexoXml)

            anexosdanfe = {
              filename: 'Danfe.pdf',
              content: Buffer.from(danfeData, 'binary'),
            }
            nomeArq = nf.chave.replace('NFe', '') + '-procNFe.xml'
            anexos = {
              filename: nomeArq,
              content: Buffer.from(anexoXml, 'utf-8'),
            }
          } else {
            anexoXml = `<procEventoNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
              ${Buffer.from(xmlNota.conteudo, 'utf-8')}
              <retEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
              ${Buffer.from(xmlNotaret.conteudo, 'utf-8')}
              </retEvento>
              </procEventoNFe>`
            nomeArq = nf.chave.replace('NFe', '') + '-procCcNFe.xml'
            anexos = {
              filename: nomeArq,
              content: Buffer.from(anexoXml, 'utf-8'),
            }
            anexoXml = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
              ${Buffer.from(xmlNota.conteudo, 'utf-8')}
              <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
              ${Buffer.from(xmlNotaret.conteudo, 'utf-8')}
              </protNFe>
              </nfeProc>`
            nomeArq = nf.chave.replace('NFe', '') + '-procNFe.xml'
            anexosdanfe = {
              filename: nomeArq,
              content: Buffer.from(anexoXml, 'utf-8'),
            }
            titulo = 'Carta Corre????o Eletr??nica ref NFe ' + nf.numeroNota + ' S??rie ' + nf.serie
          }
          emailASerEnviado = {
            from: {
              name: parameter.nfeFantasia,
              address: parameter.emailUsername,
            },
            to: nf.Email,
            cc: copiaemail,
            subject: titulo,
            html: corpo,
            attachments: [anexos, anexosdanfe],
          }
        }
        await remetente.sendMail(emailASerEnviado, function (error) {
          if (error) {
            console.log(error)
            logger.error('Erro rotina envio Email n. nota ' + nf.numeroNota, error)
            // erro = '1'
          } // else {
          // console.log('Email enviado com sucesso.')
          // erro = '0'
          // }
        })
        // if (erro === '0') {
        await prisma.$queryRaw`UPDATE nfe
          SET "emailEnviado"=${true} WHERE id = ${nf.id}`

        // }
      }
    }
  } catch (err) {
    console.log(err)
  }
}
