#!/bin/bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 /path/to/apple-touch-icon.png" >&2
  exit 1
fi

aws s3 cp "$1" s3://x-amz-date-site/apple-touch-icon.png --acl public-read
