const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

module.exports = router

router
  .get('/', (ctx) => {
    ctx.body = fs.readFileSync(path.resolve('index.html')).toString()
  })
