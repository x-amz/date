#!/bin/bash
set -e

js=$(<function.js)

dummy_response='{
  statusCode: "200",
  statusDescription: "OK",
  headers: {},
  body: {
    encoding: "text",
    data: ""
  }
}'

if [ "$1" == "-r" ]; then
  node -e "$js; const event = { response: $dummy_response }; const res = handler(event); console.dir(res, { depth: null });"
elif [ "$1" == "test" ]; then
  node -e "$js; const event = { response: $dummy_response }; const res = handler(event); require('./test.js').testXAmzDate(res.body.data);"
else
  node -e "$js; const event = { response: $dummy_response }; console.log(handler(event).body.data);"
fi
