import { DbClientParams } from '../types';

export function env(name: string) {
  if (!process.env[name] && (process.env[name] as string)?.length <= 0) {
    return false;
  }
  return process.env[name];
}

export function genEnvConfig(): DbClientParams {
  const config: DbClientParams = {
    awsAccessKey: env('S3_ACCESS_KEY') as string,
    awsSecretKey: env('S3_SECRET_KEY') as string,
    region: env('S3_DEFAULT_REGION') as string,
    dbBucket: env('S3_DB_BUCKET') as string,
  };

  validateConfig(config);

  return config;
}

export function validateConfig(config: DbClientParams) {
  if (!isGreaterThanZero(config.awsAccessKey)) {
    throw new Error('please set access key');
  }

  if (!isGreaterThanZero(config.awsSecretKey)) {
    throw new Error('please set secret key');
  }

  if (!isGreaterThanZero(config.region)) {
    throw new Error('please set region');
  }

  if (!isGreaterThanZero(config.dbBucket)) {
    throw new Error('please set bucket');
  }
}

function isGreaterThanZero(string: string) {
  return string.trim().length > 0;
}
