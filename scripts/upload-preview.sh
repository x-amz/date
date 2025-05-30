#!/bin/bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 /path/to/preview.png" >&2
  exit 1
fi

aws s3 cp "$1" s3://x-amz-date-site/preview.png --acl public-read
