import util from 'util'
import path from 'path'
import { Logger } from 'winston'

const logger = new Logger()

// Override the built-in console methods with winston hooks
switch (process.env.NODE_ENV) {
  case 'production':
    logger.add(winston.transports.File, {
      filename: path.join(__dirname, '..', '..', 'app.log'),
      handleExceptions: true,
      exitOnError: false,
      level: 'warn'
    })
    break

  case 'development':
    logger.add(winston.transports.Console, {
      colorize: true,
      timestamp: true,
      level: 'info'
    })
    break

  default:
    return null
}

const formatArgs = (args) => [util.format.apply(util.format, Array.prototype.slice.call(args))]

export const log = () => logger.info.apply(logger, formatArgs(arguments))
export const warn = () => logger.warn.apply(logger, formatArgs(arguments))
export const error = () => logger.error.apply(logger, formatArgs(arguments))
export const debug = () => logger.debug.apply(logger, formatArgs(arguments))
