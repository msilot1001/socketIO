import net, { Socket } from 'net';
import logger from './Logger.js';
import { inspect } from 'util';

const port = 25565;

const server = net.createServer();
server.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});

const sockets: Array<Socket> = [];

server.on('connection', socket => {
  logger.info(
    `Connection established to ${socket.remoteAddress}:${socket.remotePort}`,
  );
  sockets.push(socket);
  logger.info(`Currently ${sockets.length} sockets are stored`);

  const send = (text: string) => {
    const is_buffer_full = socket.write(text);
    if (!is_buffer_full) socket.pause();
  };

  socket.on('drain', () => {
    socket.resume();
  });

  socket.on('data', data => {
    logger.info(`DATA from ${socket.remoteAddress}: ${data}`);
    logger.info(data);
    logger.info(inspect(parsePacket(data), false, 3, true));
  });
  socket.on('end', () => {
    const index = sockets.findIndex(function (o) {
      return (
        o.remoteAddress === socket.remoteAddress &&
        o.remotePort === socket.remotePort
      );
    });
    if (index !== -1) sockets.splice(index, 1);
    logger.info('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
  });

  socket.on('timeout', function () {
    logger.info('Socket timed out !');
    socket.end('Timed out!');

    const index = sockets.findIndex(function (o) {
      return (
        o.remoteAddress === socket.remoteAddress &&
        o.remotePort === socket.remotePort
      );
    });
    sockets.splice(index, 1);
  });

  socket.on('error', () => {
    logger.info('Error occured');
  });
});

function parsePacket(packet: Buffer) {
  const data = packet.toJSON().data;
  const typeString = data
    .slice(0, 4)
    .map(val => {
      return String.fromCharCode(val);
    })
    .join('');
  const payload = data
    .slice(4, 1022)
    .map(val => {
      return String.fromCharCode(val);
    })
    .join('');
  const endStr = data
    .slice(1022)
    .map(val => {
      return String.fromCharCode(val);
    })
    .join('');

  const packetFormed: Packet = {
    type: typeString,
    payload: payload,
    sEnd: endStr,
  };

  return packetFormed;
}

interface Packet {
  type: String;
  payload: String;
  sEnd: String;
}
