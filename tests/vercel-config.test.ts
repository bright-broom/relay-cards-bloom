import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

type VercelConfig = { buildCommand?: string; fluid?: boolean; framework?: string; regions?: string[] };

describe("Vercel production gate", () => {
  const config = JSON.parse(readFileSync(resolve(process.cwd(), "vercel.json"), "utf8")) as VercelConfig;

  it("Next.js と必須検証付き build を固定する", () => {
    expect(config.framework).toBe("nextjs");
    expect(config.buildCommand).toBe("npm run build:vercel");
  });

  it("Fluid compute と大阪 Region を明示する", () => {
    expect(config.fluid).toBe(true);
    expect(config.regions).toEqual(["kix1"]);
  });
});
