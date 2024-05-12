import net, {Socket} from 'net';
import logger from './Logger.js';

const port = 8008;

const server = net.createServer();
server.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);

})

const sockets: Array<Socket> = [];

server.on('connection', (socket) => {
  logger.info(`Connection established to ${socket.remoteAddress}:${socket.remotePort}`);
  sockets.push(socket);

  socket.on('data', (data) => {
    logger.info(`DATA from ${socket.remoteAddress}: ${data}`);
  })
  socket.on('end', () => {
    const index = sockets.findIndex(function(o) {
      return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort;
    })
    if (index !== -1) sockets.splice(index, 1);
    console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
  })
})