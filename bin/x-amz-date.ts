#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { XAmzDateStack } from '../lib/x-amz-date-stack';

const app = new cdk.App();
new XAmzDateStack(app, 'XAmzDateStack');
