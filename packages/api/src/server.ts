import { app } from './app'
import { prisma } from './database/client'

app.listen(process.env.PORT || 5000)

process.on('SIGINT', async () => {
  let status = 0

  try {
    await prisma.$disconnect()
  } catch (err) {
    status = 1
  }

  process.exit(status)
})
