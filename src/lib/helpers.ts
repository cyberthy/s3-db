import { S3ClientConfig } from '@aws-sdk/client-s3';
import { DbClientParams } from '../types';

export function env(name: string) {
  if (!process.env[name] && (process.env[name] as string)?.length <= 0) {
    return false;
  }
  return process.env[name];
}

export function genEnvConfig(): DbClientParams & S3ClientConfig {
  const config: DbClientParams & S3ClientConfig = {
    awsAccessKey: env('AWS_ACCESS_KEY') as string,
    awsSecretKey: env('AWS_SECRET_KEY') as string,
    awsRegion: env('AWS_DEFAULT_REGION') as string,
    dbBucket: env('AWS_DB_BUCKET') as string,
  };

  validateConfig(config);

  return config;
}

export function validateConfig(config: DbClientParams & S3ClientConfig) {
  if (!isGreaterThanZero(config.awsAccessKey)) {
    throw new Error('please set access key');
  }

  if (!isGreaterThanZero(config.awsSecretKey)) {
    throw new Error('please set secret key');
  }

  if (!isGreaterThanZero(config.awsRegion)) {
    throw new Error('please set region');
  }

  if (!isGreaterThanZero(config.dbBucket)) {
    throw new Error('please set bucket');
  }
}

function isGreaterThanZero(string: string) {
  return string.trim().length > 0;
}
