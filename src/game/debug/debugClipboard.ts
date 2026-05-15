import type { DebugObjectData, DebugPoint } from "./debugTypes";

export function formatDebugPoint(point: DebugPoint): string {
  return JSON.stringify(
    {
      x: Math.round(point.x),
      y: Math.round(point.y)
    },
    null,
    2
  );
}

export function nudgeDebugObjectData<T extends DebugObjectData>(object: T, dx: number, dy: number): T {
  return {
    ...object,
    x: object.x + dx,
    y: object.y + dy,
    fromX: object.fromX === undefined ? undefined : object.fromX + dx,
    toX: object.toX === undefined ? undefined : object.toX + dx,
    fromY: object.fromY === undefined ? undefined : object.fromY + dy,
    toY: object.toY === undefined ? undefined : object.toY + dy,
    respawnX: object.linkedRespawn && object.respawnX !== undefined ? object.respawnX + dx : object.respawnX,
    respawnY: object.linkedRespawn && object.respawnY !== undefined ? object.respawnY + dy : object.respawnY
  };
}

export function resizeDebugObjectData<T extends DebugObjectData>(
  object: T,
  dWidth: number,
  dHeight: number,
  minWidth = 16,
  minHeight = 8
): T {
  return {
    ...object,
    width: Math.max(minWidth, object.width + dWidth),
    height: Math.max(minHeight, object.height + dHeight)
  };
}

export function serializeDebugObjectAsJson(object: DebugObjectData): string {
  return JSON.stringify(objectToSerializableRecord(object), null, 2);
}

export function serializeDebugObjectAsTypeScript(object: DebugObjectData): string {
  const record = objectToSerializableRecord(object);
  return [
    "{",
    ...Object.entries(record).map(([key, value]) =>
      typeof value === "string" ? `  ${key}: '${escapeSingleQuotes(value)}',` : `  ${key}: ${value},`
    ),
    "}"
  ].join("\n");
}

export function serializeDebugObjectsAsTypeScript(objects: DebugObjectData[]): string {
  return `[\n${objects.map((object) => indent(serializeDebugObjectAsTypeScript(object), 2)).join(",\n")}\n]`;
}

export async function copyTextToClipboard(text: string, onFallback: (text: string) => void): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the manual copy panel.
    }
  }

  onFallback(text);
  return false;
}

function escapeSingleQuotes(value: string): string {
  return value.replaceAll("'", "\\'");
}

function objectToSerializableRecord(object: DebugObjectData): Record<string, string | number | boolean> {
  const record: Record<string, string | number | boolean> = {
    id: object.id,
    type: object.type,
    x: Math.round(object.x),
    y: Math.round(object.y),
    width: Math.round(object.width),
    height: Math.round(object.height)
  };

  for (const key of ["axis", "fromX", "toX", "fromY", "toY", "speed"] as const) {
    const value = object[key];
    if (value !== undefined) {
      record[key] = typeof value === "number" ? Math.round(value) : value;
    }
  }
  for (const key of ["respawnX", "respawnY", "targetLevelId", "checkpointIndex"] as const) {
    const value = object[key];
    if (value !== undefined) {
      record[key] = Math.round(value);
    }
  }
  for (const key of ["name", "label", "targetScene"] as const) {
    const value = object[key];
    if (value !== undefined) {
      record[key] = value;
    }
  }
  if (object.required !== undefined) {
    record.required = object.required;
  }

  return record;
}

function indent(text: string, spaces: number): string {
  const padding = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => `${padding}${line}`)
    .join("\n");
}
