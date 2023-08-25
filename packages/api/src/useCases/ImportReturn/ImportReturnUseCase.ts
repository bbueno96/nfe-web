import { BANK } from '../../utils/getRetorno/const'
import { parseRemessaCnab } from '../../utils/getRetorno/returnBankRemittance/return'

export class ImportReturnUseCase {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}

  execute() {
    const teste = `74800000         24184147100010034269               0072800000000342692 AGRA REPRESENTACOES COMERCIAISSICREDI                                 22909202201460400000708101600
    74800011T01  040 204184147100010034269               0072800000000342692 AGRA REPRESENTACOES COMERCIAIS                                                                                000000832909202200000000
    7480001300001T 0600728 0000000342692 222002015           10000000000     10102022000000000000500000COMPE 761                      091000026778813814LEANDRO ESPER REIGOTA FERREIRA          000000000000000000000000005
    7480001300002U 060000000000000000000000000000000000000000000000000000000000000000000000005000000000000005000000000000000000000000000000002809202229092022            000000000000000                              00000000000000000000000
    7480001300003T 2800728 0000000342692 222002015           10000000000     10102022000000000000500000      761                      091000026778813814LEANDRO ESPER REIGOTA FERREIRA          000000000000000000000011505
    7480001300004U 280000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002809202228092022            000000000000000                              00000000000000000000000
    74800015         00000600000200000000000001000000000000000000000000000000000000000000000000000000000000000000000000
    74899999         000001000008000000

    `
    const retornoObj = parseRemessaCnab(BANK.sicredi.retorno[240], 240, '748', teste)
    console.log(retornoObj)
  }
}
