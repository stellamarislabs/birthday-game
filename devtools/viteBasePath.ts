export interface ViteBasePathEnv {
  VITE_BASE_PATH?: string;
}

export function resolveViteBasePath(env: ViteBasePathEnv = process.env): string {
  const configuredBasePath = env.VITE_BASE_PATH?.trim();

  return configuredBasePath && configuredBasePath.length > 0 ? configuredBasePath : "./";
}
