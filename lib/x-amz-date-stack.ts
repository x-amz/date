import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as certmgr from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class XAmzDateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'x-amz.date',
    });

    const certificate = new certmgr.Certificate(this, 'Certificate', {
      domainName: 'x-amz.date',
      validation: certmgr.CertificateValidation.fromDns(zone),
    });

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: 'x-amz-date-site',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicPolicy: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeploySite', {
      destinationBucket: siteBucket,
      sources: [s3deploy.Source.asset('site')],
    });

    const cfFunction = new cloudfront.Function(this, 'CloudFrontFunction', {
      functionName: 'xAmzDateFunction',
      comment: 'Inject current X-Amz-Date string',
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({ filePath: 'function.js' }),
    });

    const distribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        compress: false,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            function: cfFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_RESPONSE,
          },
        ],
      },
      defaultRootObject: 'index.html',
      domainNames: ['x-amz.date'],
      certificate,
    });

    new route53.ARecord(this, 'ApexAliasRecord', {
      zone,
      recordName: 'x-amz.date',
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    });
  }
}
