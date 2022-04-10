import { S3Client } from '@aws-sdk/client-s3';
import { DbClient } from '../src/DbClient';
describe('DbClient', () => {
  it('should fail with a no access key message', () => {
    try {
      const client = new DbClient({} as S3Client);
    } catch (error) {
      expect((error as any).message).toBe('No Access Key!');
    }
  });

  it('should fail with a no secret key message', () => {
    try {
      const client = new DbClient({} as S3Client);
    } catch (error) {
      expect((error as any).message).toBe('No Secret Key!');
    }
  });
});
