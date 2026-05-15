import fs from "node:fs/promises";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import {
  deleteDevLevelOverrideObject,
  emptyDevLevelOverrides,
  isValidDevOverrideLevelId,
  mergeDevLevelOverrideObjects,
  serializeDevLevelOverrides,
  validateDevLevelOverrideObject,
  validateDevLevelOverridesFile,
  type DevLevelOverrideObject,
  type DevLevelOverridesFile
} from "../src/game/debug/devLevelOverrides";

const ROUTE_PREFIX = "/__dev/level-overrides/";

export function devLevelOverridePlugin(): Plugin {
  return {
    name: "maria-dev-level-overrides",
    apply: "serve",
    configureServer(server) {
      const overridesRoot = path.resolve(server.config.root, "dev-level-overrides");

      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "", "http://localhost");
        if (!url.pathname.startsWith(ROUTE_PREFIX)) {
          next();
          return;
        }

        const levelId = parseLevelIdFromPath(url.pathname);
        if (!isValidDevOverrideLevelId(levelId)) {
          writeJson(response, 400, { ok: false, error: "Invalid level id" });
          return;
        }

        try {
          if (request.method === "GET") {
            writeJson(response, 200, await readOverrideFile(overridesRoot, levelId));
            return;
          }

          if (request.method === "POST") {
            const body = await readJsonBody(request);
            const existing = await readOverrideFile(overridesRoot, levelId);
            const overrides = readOverridePostBody(body, existing, levelId);
            if (overrides === null) {
              writeJson(response, 400, { ok: false, error: "Invalid override payload" });
              return;
            }

            await writeOverrideFile(overridesRoot, overrides);
            server.config.logger.info(`[dev-overrides] saved overrides for level ${levelId}`);
            writeJson(response, 200, { ok: true, overrides });
            return;
          }

          if (request.method === "DELETE") {
            const objectId = url.searchParams.get("objectId");
            if (!objectId) {
              writeJson(response, 400, { ok: false, error: "Missing objectId" });
              return;
            }

            const existing = await readOverrideFile(overridesRoot, levelId);
            const overrides = deleteDevLevelOverrideObject(existing, objectId);
            await writeOverrideFile(overridesRoot, overrides);
            server.config.logger.info(`[dev-overrides] deleted ${objectId} for level ${levelId}`);
            writeJson(response, 200, { ok: true, overrides });
            return;
          }

          writeJson(response, 405, { ok: false, error: "Method not allowed" });
        } catch (error) {
          server.config.logger.error(`[dev-overrides] ${error instanceof Error ? error.message : String(error)}`);
          writeJson(response, 500, { ok: false, error: "Dev override endpoint failed" });
        }
      });
    }
  };
}

export function buildOverrideFilePath(overridesRoot: string, levelId: number): string {
  if (!isValidDevOverrideLevelId(levelId)) {
    throw new Error("Invalid level id");
  }

  const root = path.resolve(overridesRoot);
  const target = path.resolve(root, `level-${levelId}.json`);
  if (!target.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid override file path");
  }

  return target;
}

function parseLevelIdFromPath(pathname: string): number {
  const raw = pathname.slice(ROUTE_PREFIX.length).replace(/^level-/, "");
  return Number(raw);
}

function readOverridePostBody(body: unknown, existing: DevLevelOverridesFile, levelId: number): DevLevelOverridesFile | null {
  if (!isRecord(body)) {
    return null;
  }

  const fullFile = validateDevLevelOverridesFile(body, levelId);
  if (fullFile && (isRecord(body.modifiedObjects) || Array.isArray(body.addedObjects) || Array.isArray(body.deletedObjectIds))) {
    return {
      ...fullFile,
      levelId,
      updatedAt: new Date().toISOString()
    };
  }

  const rawObjects = Array.isArray(body.objects) ? body.objects : isRecord(body.objects) ? Object.values(body.objects) : null;
  if (!rawObjects) {
    return null;
  }

  const updates: DevLevelOverrideObject[] = [];
  for (const rawObject of rawObjects) {
    const object = validateDevLevelOverrideObject(rawObject);
    if (!object) {
      return null;
    }
    updates.push(object);
  }

  return mergeDevLevelOverrideObjects(existing, updates);
}

async function readOverrideFile(overridesRoot: string, levelId: number): Promise<DevLevelOverridesFile> {
  const filePath = buildOverrideFilePath(overridesRoot, levelId);
  try {
    const parsed = validateDevLevelOverridesFile(JSON.parse(await fs.readFile(filePath, "utf8")), levelId);
    return parsed ?? emptyDevLevelOverrides(levelId);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return emptyDevLevelOverrides(levelId);
    }
    throw error;
  }
}

async function writeOverrideFile(overridesRoot: string, overrides: DevLevelOverridesFile): Promise<void> {
  const filePath = buildOverrideFilePath(overridesRoot, overrides.levelId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, serializeDevLevelOverrides(overrides), "utf8");
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function writeJson(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
