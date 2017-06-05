const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const http = require('http')

const router = require('./router')
const ws = require('./ws')

const app = new Koa()
app.use(bodyParser)
const server = http.createServer(app.callback())
ws(server)

app
  .use(router.routes())
  .use(router.allowedMethods())

app.on('error', console.error)

server.listen(8000, () => console.log('Listening on:' + server.address().port))
