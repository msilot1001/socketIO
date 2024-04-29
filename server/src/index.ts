import { Server } from 'socket.io';
import logger from './Logger.js';

logger.info('start');

const io = new Server();

io.on('connection', socket => {
  logger.info(`Socket Connection Created, ${socket.id}`);

  socket.on('hellow', () => {
    logger.info('hellow');
  });
});

io.listen(8008);
