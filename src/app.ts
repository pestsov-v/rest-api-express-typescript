import config from 'config'
import db from './utils/db'
import logger from './utils/logger'
import createServer from './utils/server'

const app = createServer()

const PORT = config.get<number>('port')
const listerHandler = async () => {
    logger.info(`Server is connected on: http://localhost:${PORT}`)
    await db()
}

app.listen(PORT, listerHandler)