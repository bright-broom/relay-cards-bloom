import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const relativeLuminance = (hex: string) => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  const [red = 0, green = 0, blue = 0] = channels;
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (first: string, second: string) => {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

describe("three-color system", () => {
  const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

  it("Primary 70%、Sub 20%、Accent 10% の 3 色だけを正本にする", () => {
    const colors = [...new Set(css.match(/#[0-9a-f]{6}/gi) ?? [])].map((color) => color.toLowerCase()).sort();
    expect(colors).toEqual(["#10231d", "#c8f07e", "#f4f5ef"]);
    expect(css).toContain("Primary 70%／Sub 20%／Accent 10%");
  });

  it("直接指定した RGB と旧パレットのトークンを禁止する", () => {
    expect(css).not.toMatch(/rgba?\(/i);
    expect(css).not.toMatch(/--(?:blue|coral|forest|gold|jade|mint|violet)/);
    expect(css).not.toMatch(/(?:color|background|border-color):\s*(?:black|white)\b/i);
  });

  it("本文と強調表示の主要な文字色が WCAG AAA のコントラストを満たす", () => {
    expect(contrastRatio("#f4f5ef", "#10231d")).toBeGreaterThanOrEqual(7);
    expect(contrastRatio("#c8f07e", "#10231d")).toBeGreaterThanOrEqual(7);
  });

  it("補助情報を含めて 10 px 未満の文字を作らず、主要操作の最小高を固定する", () => {
    const pixelFontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map(([, size]) => Number(size));
    expect(Math.min(...pixelFontSizes)).toBeGreaterThanOrEqual(10);
    expect(css).toContain("--tap-min: 44px");
    expect(css).toContain("min-height: var(--tap-min)");
  });

  it("黄金比を余白と主要 2 カラムの設計トークンとして保持する", () => {
    expect(css).toContain("--phi: 1.618");
    expect(css).toContain("--space-1: 10px");
    expect(css).toContain("--space-2: 16px");
    expect(css).toContain("--space-3: 26px");
    expect(css).toContain("--space-4: 42px");
    expect(css).toContain("--space-5: 68px");
    expect(css).toContain("--font-body: 14px");
    expect((css.match(/1\.618fr/g) ?? []).length).toBeGreaterThanOrEqual(5);
  });
});
