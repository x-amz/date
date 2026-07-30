# x-amz-date

Demonstration CloudFront function returning the current timestamp.
The HTML page and preview image are served from an S3 bucket.

Requests without an `Accept` header (and non-HTML requests) receive the timestamp
as a single `text/plain` string. Requests that explicitly accept `text/html`
receive the rich-link HTML page. Preview image and favicon requests pass through
to the S3 origin.

## Usage

- `./run.sh` – run the function locally and print the timestamp.
- `npm test` or `./run.sh test` – run the local behavior tests.
- `npm run build` – type-check the CDK application.
- `./integration-test.sh` – hit the deployed URL and verify the response.

## Deployment

This project uses the AWS CDK. After installing dependencies with `npm install`,
deploy the stack with:

```
npx cdk deploy --require-approval never
```

The deployment automatically packages `function.js` and provisions the
CloudFront distribution and S3 bucket.

Upload a `preview.png` file to the bucket with:

```
scripts/upload-preview.sh /path/to/preview.png
```

The image will be available at `https://x-amz.date/preview.png`.
