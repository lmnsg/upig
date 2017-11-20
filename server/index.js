require('babel-register')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const http = require('http')
const history = require('koa-connect-history-api-fallback')

const router = require('./router')
const ws = require('./ws')

const app = new Koa()
const server = http.createServer(app.callback())

ws(server)

app
  .use(history())
  .use(require('koa-static')('./dist'))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

server.listen(8000, () => console.log('Listening on:' + server.address().port))
