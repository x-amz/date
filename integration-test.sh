#!/bin/bash
set -e
URL="https://x-amz.date"
OUTPUT=$(curl -s $URL)
echo "Output: $OUTPUT"
node -e "require('./test.js').testXAmzDate('$OUTPUT')"
