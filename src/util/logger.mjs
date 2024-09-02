/* eslint-disable new-cap */
import { transports, createLogger, format } from 'winston'
import logConfig from './loggerConfig.mjs'

const { timestamp, printf, combine } = format

const dirname = logConfig.location
const { prefix } = logConfig

const logFormat = printf(({
  level, message, timestamp,
}) => `${timestamp} - ${level}: ${message}`)

const defaultTransports = []

const { fileLogConfig } = logConfig
fileLogConfig.filename = `${dirname}/${prefix}${fileLogConfig.filename}`
defaultTransports.push(new transports.File(fileLogConfig))

if (logConfig.enableConsoleLog) {
  const { consoleLogConfig } = logConfig
  defaultTransports.push(new transports.Console(consoleLogConfig))
}

const logger = new createLogger({
  transports: defaultTransports,
  exitOnError: false,
  format: combine(
    timestamp(),
    logFormat,
  ),
})

const { processLogConfig } = logConfig
processLogConfig.filename = `${dirname}/${prefix}${processLogConfig.filename}`
const processTransports = []
processTransports.push(new transports.File(processLogConfig))

if (logConfig.enableConsoleLog) {
  const { consoleLogConfig } = logConfig
  processTransports.push(new transports.Console(consoleLogConfig))
}
const processLogger = new createLogger({
  transports: processTransports,
  exitOnError: false,
  format: combine(
    timestamp(),
    logFormat,
  ),
})

const { speedIndexLogConfig } = logConfig
speedIndexLogConfig.filename = `${dirname}/${prefix}${speedIndexLogConfig.filename}`
const speedIndexTransports = []
speedIndexTransports.push(new transports.File(speedIndexLogConfig))
const speedIndexLogger = new createLogger({
  transports: speedIndexTransports,
  exitOnError: false,
  format: combine(
    timestamp(),
    logFormat,
  ),
})

export { logger, processLogger, speedIndexLogger }

export const stream = {
  write(message, encoding) {
    logger.info(message)
  },
}
