import { DbClient } from '../src/DbClient';
describe('DbClient', () => {
  it('should fail with a no access key message', () => {
    try {
      const client = new DbClient({
        awsAccessKey: '',
        awsSecretKey: 'fefefe',
      });
    } catch (error) {
      expect((error as any).message).toBe('No Access Key!');
    }
  });

  it('should fail with a no secret key message', () => {
    try {
      const client = new DbClient({
        awsAccessKey: 'fefefe',
        awsSecretKey: '',
      });
    } catch (error) {
      expect((error as any).message).toBe('No Secret Key!');
    }
  });
});
