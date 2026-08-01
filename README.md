# x-amz-date

Demonstration CloudFront function returning the current timestamp.
The HTML page and touch icon are served from an S3 bucket.

Requests without an `Accept` header (and non-HTML requests) receive the timestamp
as a single `text/plain` string. Requests that explicitly accept `text/html`
receive the rich-link HTML page. Icon and favicon requests pass through
to the S3 origin.

The page advertises an `apple-touch-icon` and no `og:image`, so Messages
renders the compact inline preview rather than a large image card.

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

The `site/` directory (HTML page and touch icon) deploys to the bucket with the
stack. To push a new icon without a full deploy:

```
scripts/upload-icon.sh /path/to/apple-touch-icon.png
```

The image will be available at `https://x-amz.date/apple-touch-icon.png`.
