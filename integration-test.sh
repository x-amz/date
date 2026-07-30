#!/bin/bash
set -e
URL="https://x-amz.date"
OUTPUT=$(curl -sf "$URL") || STATUS=$?
if [ -n "$STATUS" ]; then
  echo "HTTP request failed with status $STATUS" >&2
  exit $STATUS
fi
echo "Output: $OUTPUT"
if [[ ! "$OUTPUT" =~ ^[0-9]{8}T[0-9]{6}Z$ ]]; then
  echo "Response is not a single x-amz-date timestamp" >&2
  exit 1
fi
