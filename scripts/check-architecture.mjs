import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";

import ts from "typescript";

const root = resolve(process.cwd(), "src");
const failures = [];
const approvedFeatureEntries = new Set(["index", "primitives", "state", "ui"]);
const files = walk(root);
const fileSet = new Set(files);
const dependencyGraph = new Map();

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : /\.tsx?$/.test(entry) ? [path] : [];
  });
}

function featureOf(path) {
  const match = path.replaceAll(sep, "/").match(/\/features\/([^/]+)\//);
  return match?.[1] ?? null;
}

function resolveLocalModule(importer, specifier) {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return null;
  const base = specifier.startsWith("@/")
    ? resolve(root, specifier.slice(2))
    : resolve(dirname(importer), specifier);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, resolve(base, "index.ts"), resolve(base, "index.tsx")];
  return candidates.find((candidate) => existsSync(candidate) && fileSet.has(candidate)) ?? null;
}

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(process.cwd(), file).replaceAll(sep, "/");
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const moduleSpecifiers = parsed.statements
    .filter((node) => (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier))
    .map((node) => node.moduleSpecifier.text);
  dependencyGraph.set(file, moduleSpecifiers.map((specifier) => resolveLocalModule(file, specifier)).filter(Boolean));

  if (displayPath.startsWith("src/shared/") && moduleSpecifiers.some((specifier) => specifier.startsWith("@/features/") || specifier.startsWith("@/app/"))) {
    failures.push(`${displayPath}: shared は feature または app に依存できません`);
  }

  if (/src\/features\/[^/]+\/model\//.test(displayPath) && moduleSpecifiers.some((specifier) => specifier === "react" || specifier.startsWith("next") || specifier.includes("/ui"))) {
    failures.push(`${displayPath}: domain model は React、Next.js、UI に依存できません`);
  }

  const owner = featureOf(file);
  for (const specifier of moduleSpecifiers.filter((value) => value.startsWith("@/features/"))) {
    const parts = specifier.slice("@/features/".length).split("/");
    const target = parts[0];
    if (!target || target === owner) continue;
    const entry = parts[1] ?? "index";
    if (!approvedFeatureEntries.has(entry) || parts.length > 2) {
      failures.push(`${displayPath}: ${specifier} は公開 entrypoint 経由で import してください`);
    }
  }
}

const entrypoints = files.filter((file) => file.startsWith(resolve(root, "app") + sep) || file === resolve(root, "proxy.ts"));
const reachable = new Set(entrypoints);
const queue = [...entrypoints];
while (queue.length) {
  const current = queue.shift();
  for (const dependency of dependencyGraph.get(current) ?? []) {
    if (reachable.has(dependency)) continue;
    reachable.add(dependency);
    queue.push(dependency);
  }
}
for (const file of files.filter((candidate) => !reachable.has(candidate))) {
  failures.push(`${relative(process.cwd(), file).replaceAll(sep, "/")}: App または Proxy から到達できない Source file です`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("ARCHITECTURE_OK: 依存方向、feature entrypoint、Source file の到達可能性を確認しました");
}
