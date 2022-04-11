import { S3Client } from "@aws-sdk/client-s3";
import { genEnvConfig, validateConfig } from "./lib/helpers";
import s3Client from "./lib/s3Client";
import { DbClientParams, IS3DbConnectParams } from "./types";
import { DbClient } from "./DbClient";

export let client: S3Client;
export let dbInstance: DbClient;
export let globalConfig: DbClientParams;

export function connect(params?: IS3DbConnectParams) {
  try {
    const { s3Config } = params as any;
    let config;
    if (!s3Config) {
      config = genEnvConfig();
    } else {
      validateConfig(s3Config);
      config = s3Config;
    }
    globalConfig = config;
    client = s3Client(config);
    dbInstance = new DbClient(client);
    return client;
  } catch (error) {
    throw new Error(error as any).message;
  }
}