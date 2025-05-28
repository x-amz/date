# x-amz-date

Demonstration CloudFront function returning the current timestamp.

## Usage

- `./run.sh` – run the function locally and print the timestamp.
- `./run.sh test` – run a local test of the function output.
- `./integration-test.sh` – hit the deployed URL and verify the response.

## Deployment

This project uses the AWS CDK. After installing dependencies with `npm install`,
deploy the stack with:

```
npx cdk deploy --require-approval never
```

The deployment automatically packages `function.js` and provisions the
CloudFront distribution.
