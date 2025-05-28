#!/bin/bash
set -e
URL="https://x-amz.date"
OUTPUT=$(curl -sf "$URL") || STATUS=$?
if [ -n "$STATUS" ]; then
  echo "HTTP request failed with status $STATUS" >&2
  exit $STATUS
fi
echo "Output: $OUTPUT"
node -e "require('./test.js').testXAmzDate('$OUTPUT')"

