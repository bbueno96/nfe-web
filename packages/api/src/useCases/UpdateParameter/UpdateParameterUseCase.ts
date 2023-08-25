import { Prisma } from '@prisma/client'

import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateParameterDTO } from './UpdateParameterDTO'

export class UpdateParameterUseCase {
  constructor(private parameterRepository: ParameterRepository) {}

  validate(data: IUpdateParameterDTO) {
    if (!data.pfx) {
      throw new ApiError('Certificado é obrigatório.', 422)
    }

    if (!data.passwordCert) {
      throw new ApiError('Senha do certificado é obrigatório.', 422)
    }
  }

  sanitizeData(data: IUpdateParameterDTO) {
    data.nfeCep = data.nfeCep?.replace(/\D/g, '')
    data.nfeFone = data.nfeFone?.replace(/\D/g, '')
  }

  async execute(data: IUpdateParameterDTO) {
    if (data.companyId) {
      const oldData = await this.parameterRepository.getParameter(data.companyId)

      if (!oldData) {
        throw new ApiError('Parametro não encontrado.', 404)
      }

      await this.parameterRepository.update(
        oldData.id,
        {
          ...oldData,
          ...data,
          nfeUfCod: +data.nfeUfCod,
          nfeCidadeCod: +data.nfeCidadeCod,
          nfeIndPresenca: +data.nfeIndPresenca,
          nfeCrt: +data.nfeCrt,
          emailPort: +data.emailPort || null,
          serie: +data.serie,
          fine: new Prisma.Decimal(data.fine || 0),
          interest: new Prisma.Decimal(data.interest || 0),
        },
        null,
      )
    }
  }
}
