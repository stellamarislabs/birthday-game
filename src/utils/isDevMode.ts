export interface DevModeEnv {
  dev?: boolean;
  mode?: string;
}

export function isDevMode(env?: DevModeEnv): boolean {
  if (env) {
    return env.dev === true || env.mode === "test";
  }

  return import.meta.env.DEV || import.meta.env.MODE === "test";
}
