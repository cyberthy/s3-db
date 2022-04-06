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
    awsAccessKey: '',
    awsSecretKey: '',
    awsRegion: '',
  };

  if (!env('AWS_ACCESS_KEY')) {
    throw new Error('please set access key');
  }
  config.awsAccessKey = env('AWS_ACCESS_KEY') as string;

  if (!env('AWS_SECRET_KEY')) {
    throw new Error('please set secret key');
  }
  config.awsSecretKey = env('AWS_SECRET_KEY') as string;

  if (!env('AWS_DEFAULT_REGION')) {
    throw new Error('please set a default region key');
  }
  config.awsRegion = env('AWS_DEFAULT_REGION') as string;

  return config;
}
