import { io } from 'socket.io-client';
import logger from './Logger.js';

logger.info('start');

const socket = io('http://localhost:8008', { reconnection: true });

// client-side
socket.on('connect', () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.emit('hellow');
