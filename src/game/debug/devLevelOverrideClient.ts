import {
  emptyDevLevelOverrides,
  type DevLevelOverrideObject,
  type DevLevelOverridesFile,
  serializeDevLevelOverrides,
  validateDevLevelOverridesFile
} from "./devLevelOverrides";

interface SaveDevLevelOverridesResponse {
  ok: boolean;
  overrides: DevLevelOverridesFile;
}

export async function fetchDevLevelOverrides(levelId: number): Promise<DevLevelOverridesFile> {
  try {
    const response = await fetch(endpointForLevel(levelId), {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      return emptyDevLevelOverrides(levelId);
    }

    const parsed = validateDevLevelOverridesFile(await response.json(), levelId);
    return parsed ?? emptyDevLevelOverrides(levelId);
  } catch {
    return emptyDevLevelOverrides(levelId);
  }
}

export async function saveDevLevelOverrideObjects(levelId: number, objects: DevLevelOverrideObject[]): Promise<DevLevelOverridesFile> {
  const response = await fetch(endpointForLevel(levelId), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ objects })
  });

  if (!response.ok) {
    throw new Error(`Dev override save failed with ${response.status}`);
  }

  const body = (await response.json()) as SaveDevLevelOverridesResponse;
  return body.overrides;
}

export async function saveDevLevelOverridesFile(levelId: number, overrides: DevLevelOverridesFile): Promise<DevLevelOverridesFile> {
  const response = await fetch(endpointForLevel(levelId), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: serializeDevLevelOverrides(overrides)
  });

  if (!response.ok) {
    throw new Error(`Dev override save failed with ${response.status}`);
  }

  const body = (await response.json()) as SaveDevLevelOverridesResponse;
  return body.overrides;
}

export async function deleteDevLevelOverride(levelId: number, objectId: string): Promise<DevLevelOverridesFile> {
  const response = await fetch(`${endpointForLevel(levelId)}?objectId=${encodeURIComponent(objectId)}`, {
    method: "DELETE",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Dev override delete failed with ${response.status}`);
  }

  const body = (await response.json()) as SaveDevLevelOverridesResponse;
  return body.overrides;
}

function endpointForLevel(levelId: number): string {
  return `/__dev/level-overrides/${levelId}`;
}
