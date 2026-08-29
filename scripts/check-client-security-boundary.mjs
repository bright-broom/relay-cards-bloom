import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

const roots = [resolve(process.cwd(), "src/features"), resolve(process.cwd(), "src/shared/ui")];
const deniedPatterns = [
  { label: "direct network access", pattern: /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b/ },
  { label: "beacon transmission", pattern: /navigator\.sendBeacon/ },
  { label: "unsafe HTML injection", pattern: /dangerouslySetInnerHTML|\.innerHTML\b/ },
  { label: "dynamic code execution", pattern: /\beval\s*\(|new\s+Function\s*\(/ },
  { label: "unreviewed browser persistence", pattern: /\b(?:localStorage|sessionStorage|document\.cookie)\b/ }
];
const failures = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : /\.tsx?$/.test(entry) ? [path] : [];
  });
}

for (const file of roots.flatMap(walk)) {
  const source = readFileSync(file, "utf8");
  for (const { label, pattern } of deniedPatterns) {
    if (pattern.test(source)) failures.push(`${relative(process.cwd(), file).replaceAll(sep, "/")}: ${label} は現在の Client boundary で禁止です`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("CLIENT_SECURITY_OK: 外部送信、危険な HTML、動的 Code、未審査の永続化がないことを確認しました");
}
