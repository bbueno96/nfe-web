import { ImportReturnController } from './ImportReturnController'
import { ImportReturnUseCase } from './ImportReturnUseCase'

const importReturnUseCase = new ImportReturnUseCase()

const importReturnController = new ImportReturnController(importReturnUseCase)

export { importReturnUseCase, importReturnController }
