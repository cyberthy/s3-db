export function env(name: string) {
  if (!process.env[name] && (process.env[name] as string)?.length <= 0) {
    return false;
  }
  return process.env[name];
}
