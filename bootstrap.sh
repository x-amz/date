#!/bin/bash

set -euo pipefail

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

# === 1. Create OIDC provider ===
PROVIDER_ARN="arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$PROVIDER_ARN" &>/dev/null; then
  echo "Creating GitHub OIDC provider..."
  aws iam create-open-id-connect-provider \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1"
else
  echo "OIDC provider already exists."
fi

# === 2. Create GitHub Federation Role ===
GITHUB_ROLE_NAME="GitHubFederationRole"

cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "$PROVIDER_ARN"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:x-amz/*"
        },
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}
EOF

echo "Creating GitHub federation role..."
aws iam create-role \
  --role-name "$GITHUB_ROLE_NAME" \
  --assume-role-policy-document file://trust-policy.json \
  --description "Role assumed by GitHub Actions to deploy CloudFormation stacks" \
  || echo "Role already exists"
  
rm trust-policy.json

aws iam attach-role-policy \
  --role-name "$GITHUB_ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AWSCloudFormationFullAccess

TRUSTED_ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$GITHUB_ROLE_NAME"

# --- Bootstrap the environment ---
echo "Bootstrapping CDK for account $ACCOUNT_ID in $REGION"
npx cdk bootstrap \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  --trust "$TRUSTED_ROLE_ARN" \
  aws://$ACCOUNT_ID/$REGION
