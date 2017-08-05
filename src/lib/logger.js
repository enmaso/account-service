import winston from 'winston'

winston.emitErrs = true
const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: 'error.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false,
      timestamp: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitonError: false
})
module.exports = logger
module.exports.stream = {
  write: (message, encoding) => {
    logger.info(message)
  }
}
