#!/bin/sh

/usr/local/bin/cnpm install
npm run build
/usr/local/bin/pm2 reload upig

