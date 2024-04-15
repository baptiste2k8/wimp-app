// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const session = require('express-session');
const WebSocket=require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

//Create a Websocket server completely detached from the HTTP Server
const wss=new WebSocket.Server({port:8181});
const wsSelected=new Set();
wss.on('connection', function connection(ws){
  wsSelected.add(ws);
  console.log('Client Connecting....');
  ws.on('message', function incoming(message){
    wsSelected.forEach(function each(client) {
      console.log(client.readyState);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Echo:${message}`);
      }
    })
    console.log('received:%s',message);
    //echo the message back to the client
    ws.send(`Echo: ${message}`);
  });
  });
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  }));
  
  // Set up middleware to parse request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());



app.use('/', routes);

app.listen(PORT, (req, res) => {
  console.log(`App is running on port ${PORT}`);
});