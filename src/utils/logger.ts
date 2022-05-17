import logger from 'pino'

const log = logger({
    transport: {
        target: 'pino-pretty',
    },
    base: {
        pid: false
    },
})

export default log