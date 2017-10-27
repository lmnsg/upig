#!/bin/sh

/usr/local/bin/cnpm install
npm run build
kill [']netstat -nlp | grep :8000 | awk '{print $7}' | awk -F"/" '{ print $1 }'[']
npm run server

