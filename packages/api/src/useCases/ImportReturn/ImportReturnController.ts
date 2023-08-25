import { Request, Response } from 'express'

import { ImportReturnUseCase } from './ImportReturnUseCase'

export class ImportReturnController {
  constructor(private importReturnUseCase: ImportReturnUseCase) {
    this.handle = this.handle.bind(this)
  }

  handle(request: Request, response: Response) {
    this.importReturnUseCase.execute()

    return response.status(204).send()
  }
}
