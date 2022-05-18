const pino = require('pino')
const pretty = require('pino-pretty')

const log = pino(pretty())

export default log;