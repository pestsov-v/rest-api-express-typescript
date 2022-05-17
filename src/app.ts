import express from 'express'
import config from 'config'
import db from './utils/db'
import logger from './utils/logger'
import routes from './routes'

const app = express()

const PORT = config.get<number>('port')
const listerHandler = async () => {
    logger.info(`Server is connected on: http://localhost:${PORT}`)
    await db()
    routes(app)
}

app.listen(PORT, listerHandler)