import { TaxSituationsRepository } from '../repositories/TaxSituationsRepository'

export async function getCESTByNCM(NCM: string): Promise<string> {
  const taxSituationsRepository = new TaxSituationsRepository()
  const row = await taxSituationsRepository.findCestByNcm(NCM)
  let cest = '2899900'

  if (row) cest = row.CEST

  return cest
}
