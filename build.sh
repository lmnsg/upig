#!/bin/sh

/usr/local/bin/cnpm install
npm run build
/usr/local/bin/pm2 stop upig
/usr/local/bin/pm2 start ./server/index.js --name="upig" --max_memory_restart 1024M

