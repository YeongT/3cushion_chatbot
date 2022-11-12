import fs from 'fs';
import http from 'http';
import https from 'https';
import { app } from './app';

const port = process.env.PORT || '3000';
let server: http.Server | https.Server;

if (process.env.HTTPS === 'true') {
  if (!process.env.HTTPS_PRIVKEY)
    throw new Error('[HTTPS] NO PRIVATE KEY FILE PATH FOR HTTPS EXPRESS SERVER');
  if (!process.env.HTTPS_CHAIN) throw new Error('[HTTPS] NO CHAIN FILE PATH FOR HTTPS EXPRESS SERVER');
  if (!process.env.HTTPS_CERT) throw new Error('[HTTPS] NO CERT FILE PATH FOR HTTPS EXPRESS SERVER');

  const credentials: https.ServerOptions = {
    key: fs.readFileSync((process.env.DO_NOT_ADD_DIRNAME ? '' : __dirname) + process.env.HTTPS_PRIVKEY),
    cert: fs.readFileSync((process.env.DO_NOT_ADD_DIRNAME ? '' : __dirname) + process.env.HTTPS_CERT),
    ca: fs.readFileSync((process.env.DO_NOT_ADD_DIRNAME ? '' : __dirname) + process.env.HTTPS_CHAIN),
  };
  server = https.createServer(credentials, app);
} else server = http.createServer(app);

app.set('port', port);
const onError = (error: { syscall: string; code: any }) => {
  if (error.syscall !== 'listen') throw error;

  switch (error.code) {
    case 'EACCES':
      throw new Error(`${port} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${port} is already in use`);
    default:
      throw error;
  }
};

const onListening = () => {
  console.log(
    `\n\n${process.env.HTTPS === 'true' ? '[HTTPS] Secured ' : '[HTTP] '}API Server is Running on ${port}`,
  );
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
