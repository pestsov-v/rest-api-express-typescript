import mongoose from 'mongoose'
import config from "config";
import logger from "./logger";

async function db() {
    const dbUri = config.get<string>('dbUri')

    try {
        await mongoose.connect(dbUri)
        logger.info('Success connected to database')
    } catch (e) {
        logger.error('Connected has not recognized')
        process.exit(1)
    }
}

export default db