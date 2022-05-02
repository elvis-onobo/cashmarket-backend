import { format, createLogger, transports } from 'winston'
const { combine, timestamp, errors, json, colorize, printf } = format

const environment = process.env.NODE_ENV

const logger = () => {
 let logFormat = printf(({level, message, timestamp, stack}) => {
  return `${timestamp}, ${level}, ${stack || message}`
 })

 if (environment === 'development') {
  return createLogger({
   format: combine(colorize(),timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
   transports: [new transports.Console()],
  })
 } else {
  return createLogger({
   format: combine(timestamp(), errors({ stack: true }), json()),
   transports: [new transports.Console()],
  })
 }
}

export default logger()
