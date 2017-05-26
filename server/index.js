const Koa = require('koa')
const router = require('./router')
const WebSocket = require('ws')
const http = require('http')

const app = new Koa()
app.listen()
const server = http.createServer(app.callback())

const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
  console.log(ws)
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

app
  .use(router.routes())
  .use(router.allowedMethods())

server.listen(8000, () => console.log('Listening on:' + server.address().port))
