require('colors');
const express = require('express');
const serveStatic = require('serve-static');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

const addresses = require('./util').addresses();

app
  .use(serveStatic('./build/'))

server.listen(port, '0.0.0.0', () => { 
  for(let i in addresses){
    let serverAddress = "Server on: http://" + addresses[i] + ":" + port;
    console.log(serverAddress.cyan); 
  }
  let serverAddress = 'Server on: http://localhost:' + port;
  console.log(serverAddress.cyan);
});