import nodemailer from 'nodemailer'

import { prisma } from '../../database/client'
import { Parameter } from '../../entities/Parameter'
import { NfeRepository } from '../../repositories/NfeRepository'
import { logger } from '../../utils/logger'
import { maskCpfCnpj } from '../../utils/mask'
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
      await prisma.$queryRaw<NFeEmail>`SELECT nfe.id, chave, serie, "numeroNota",nfe.status as "Status",nfe.email as "Email",  nfe."razaoSocial", "totalNota","cartaCorrecao", nfe."cpfCnpj", nfe."statuscartaCorrecao", '' as "EmailTransp" FROM nfe
  WHERE nfe.id =${nota}`
    const nf = nfArray[0]
    if (nf.Email && parameter.emailHost) {
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
                <b>Prezado(a) ${nf?.razaoSocial || ''} - ${maskCpfCnpj(nf?.cpfCnpj) || ''},</b>
            </p>
            <p>
                Você está recebendo a Nota Fiscal Eletrônica número ${nf.numeroNota}, série ${nf.serie} de ${
        parameter.nfeFantasia
      },
                no valor de R$ ${nf.totalNota.toFixed(
                  2,
                )}. Junto com a mercadoria, você receberá também um DANFE (Documento
                Auxiliar da Nota Fiscal Eletrônica), que acompanha o trânsito das mercadorias.
            </p>
            <p>
                <i>A Nota Fiscal Eletrônica é um documento de existência apenas digital, emitido e armazenado
                    eletronicamente, com o intuito de documentar, para fins fiscais, uma operação de
                    circulação de mercadorias ocorrida entre as partes. Sua validade jurídica, autoria
                    e integridade é garantida pela assinatura digital do remetente e pela recepção pelo
                    Fisco do documento eletrônico antes da ocorrência do Fato Gerador. </i>
            </p>
            <p>
                <i>Os registros fiscais e contábeis devem ser feitos, a partir do próprio arquivo da
                    NF-e, anexo neste e-mail, ou utilizando o DANFE, que representa graficamente a Nota
                    Fiscal Eletrônica. A validade e autenticidade deste documento eletrônico pode ser
                    verificada no site nacional do projeto (<a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                        www.nfe.fazenda.gov.br</a>), através da chave de acesso contida no DANFE.</i>
            </p>
            <p>
                <i>Para poder utilizar os dados descritos do DANFE na escrituração da NF-e, tanto o
                    contribuinte destinatário, como o contribuinte emitente, terão de verificar a validade
                    da NF-e. Esta validade está vinculada à efetiva existência da NF-e nos arquivos
                    da SEFAZ, e comprovada através da emissão da Autorização de Uso. </i>
            </p>
            <p>
                <b>O DANFE não é uma nota fiscal, nem substitui uma nota fiscal, servindo apenas como
                    instrumento auxiliar para consulta da NF-e no Ambiente Nacional. </b>
            </p>
            <p>
                Para mais detalhes sobre o projeto, consulte: <a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                    www.nfe.fazenda.gov.br</a>
            </p>
            <p>
                Para vizualizar o DANFE anexado é nescessário possuir um leitor de PDF instalado.
                Se você ainda não o possui, pode baixar em <a href='http://get.adobe.com/br/reader/'>
                    get.adobe.com/br/reader/</a>
            </p>
            <p>
                Para vizualizar o arquivo XML anexado use o Visualizador NFeCTe50b ou maior, que
                pode ser obtido na seção Download, Visualizador de NFe em <a href='http://www.nfe.fazenda.gov.br/portal/visualizador.aspx'>
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
                Você está recebendo o <b>cancelamento</b> da Nota Fiscal Eletrônica número ${nf.numeroNota}, série ${nf.serie} de ${parameter.nfeFantasia},
                no valor de R$ ${nf.totalNota}.
            </p>
            <p>
                <i>A Nota Fiscal Eletrônica é um documento de existência apenas digital, emitido e armazenado
                    eletronicamente, com o intuito de documentar, para fins fiscais, uma operação de
                    circulação de mercadorias ocorrida entre as partes. Sua validade jurídica, autoria
                    e integridade é garantida pela assinatura digital do remetente e pela recepção pelo
                    Fisco do documento eletrônico antes da ocorrência do Fato Gerador. </i>
            </p>
            <p>
                <i>Os registros fiscais e contábeis devem ser feitos, a partir do próprio arquivo da
                    NF-e, anexo neste e-mail, ou utilizando o DANFE, que representa graficamente a Nota
                    Fiscal Eletrônica. A validade e autenticidade deste documento eletrônico pode ser
                    verificada no site nacional do projeto (<a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                        www.nfe.fazenda.gov.br</a>), através da chave de acesso contida no DANFE.</i>
            </p>
            <p>
                Para mais detalhes sobre o projeto, consulte: <a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                    www.nfe.fazenda.gov.br</a>
            </p>
            <p>
                Para vizualizar o arquivo XML anexado use o Visualizador NFeCTe50b ou maior, que
                pode ser obtido na seção Download, Visualizador de NFe em <a href='http://www.nfe.fazenda.gov.br/portal/visualizador.aspx'>
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
                Você está recebendo a <b>Carta de Correção Eletrônica</b> da Nota Fiscal Eletrônica número ${
                  nf.numeroNota
                }, série ${nf.serie} de ${parameter.nfeFantasia},
                no valor de R$ ${nf.totalNota}.
            </p>
            <p>
                Texto da Carta de Correção: ${nf.cartaCorrecao}
            </p>
            <p>
                <i>A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída. </i>
            </p>
            <p>
                <i>A validade e autenticidade deste documento eletrônico pode ser
                    verificada no site nacional do projeto (<a href='http://www.nfe.fazenda.gov.br/portal/Default.aspx'>
                        www.nfe.fazenda.gov.br</a>), através da chave de acesso contida no DANFE ${nf.chave.replace(
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
                pode ser obtido na seção Download, Visualizador de NFe em <a href='http://www.nfe.fazenda.gov.br/portal/visualizador.aspx'>
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
      let copiaemail
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
              ${xmlNota.conteudo?.toString('utf-8')}
              <retEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
              ${xmlNotaret.conteudo?.toString('utf-8')}
              </retEvento>
              </procEventoNFe>`
            nomeArq = nf.chave.replace('NFe', '') + '-procCanNFe.xml'
            titulo = 'Cancelamento Nota Fiscal Eletrônica Número ' + nf.numeroNota + ' Série ' + nf.serie
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
              ${xmlNota.conteudo?.toString('utf-8')}
              <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
              ${xmlNotaret.conteudo?.toString('utf-8')}
              </protNFe>
              </nfeProc>`
              titulo = 'Nota Fiscal Eletrônica Número ' + nf.numeroNota + ' Série ' + nf.serie
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
              ${xmlNota.conteudo?.toString('utf-8')}
              <retEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
              ${xmlNotaret.conteudo?.toString('utf-8')}
              </retEvento>
              </procEventoNFe>`
              nomeArq = nf.chave.replace('NFe', '') + '-procCcNFe.xml'
              anexos = {
                filename: nomeArq,
                content: Buffer.from(anexoXml, 'utf-8'),
              }
              anexoXml = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
              ${xmlNota.conteudo?.toString('utf-8')}
              <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
              ${xmlNotaret.conteudo?.toString('utf-8')}
              </protNFe>
              </nfeProc>`
              nomeArq = nf.chave.replace('NFe', '') + '-procNFe.xml'
              anexosdanfe = {
                filename: nomeArq,
                content: Buffer.from(anexoXml, 'utf-8'),
              }
              titulo = 'Carta Correção Eletrônica ref NFe ' + nf.numeroNota + ' Série ' + nf.serie
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
          let erro = '0'
          await remetente.sendMail(emailASerEnviado, function (error) {
            if (error) {
              console.log(error)
              logger.error('Erro rotina envio Email n. nota ' + nf.numeroNota, error)
              erro = '1'
            } else {
              // console.log('Email enviado com sucesso.')
              erro = '0'
            }
          })
          if (erro === '0') {
            await prisma.$queryRaw`UPDATE nfe
          SET "emailEnviado"=${true} WHERE id = ${nf.id}`
          }
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}
