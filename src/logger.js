import winston from 'winston';
const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(
    colorize(),
    timestamp(),
    customFormat
  ),
  levels: winston.config.npm.levels,
  transports: [new winston.transports.Console()],
});

export default logger;
