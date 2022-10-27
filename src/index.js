import app, { PORT, HOST } from './server.js';
import logger from './logger.js';

app.listen(PORT, HOST, (error) => {
  if (error) {
    return logger.error(error.message);
  }

  logger.info(`Server listening on port ${PORT}`);
});
