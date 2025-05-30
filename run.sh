#!/bin/bash
set -e

js=$(<function.js)

# Minimal request object for local execution
dummy_request='{
  uri: "/"
}'

if [ "$1" == "-r" ]; then
  node -e "$js; const fs=require('fs'); const html=fs.readFileSync('site/index.html','utf8'); const event={ request: $dummy_request, response: { statusCode:'200', statusDescription:'OK', headers:{'content-type':{value:'text/html; charset=utf-8'}}, body:{encoding:'text', data: html}}}; const res=handler(event); console.dir(res,{depth:null});"
elif [ "$1" == "test" ]; then
  node -e "$js; const fs=require('fs'); const html=fs.readFileSync('site/index.html','utf8'); const event={ request: $dummy_request, response: { statusCode:'200', statusDescription:'OK', headers:{'content-type':{value:'text/html; charset=utf-8'}}, body:{encoding:'text', data: html}}}; const res=handler(event); require('./test.js').testXAmzDate(res.headers['x-amz-date'].value);"
else
  node -e "$js; const fs=require('fs'); const html=fs.readFileSync('site/index.html','utf8'); const event={ request: $dummy_request, response: { statusCode:'200', statusDescription:'OK', headers:{'content-type':{value:'text/html; charset=utf-8'}}, body:{encoding:'text', data: html}}}; console.log(handler(event).body.data);"
fi
