import { TaxSituationsRepository } from '../repositories/TaxSituationsRepository'

export async function getAliquotaTributo(NCM: string): Promise<number> {
  const taxSituationsRepository = new TaxSituationsRepository()
  let aliquotas = await taxSituationsRepository.findIbptByNcm(NCM)

  if (!aliquotas) {
    aliquotas = await taxSituationsRepository.findIbptByNcm('49019900')
  }

  const sumAliquota = parseFloat(aliquotas.AliqNac) + parseFloat(aliquotas.AliqEst) + parseFloat(aliquotas.AliqMun)

  return sumAliquota
}
