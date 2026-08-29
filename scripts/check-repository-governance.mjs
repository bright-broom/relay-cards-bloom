import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const failures = [];
const requiredFiles = [
  ".github/CODEOWNERS",
  ".github/dependabot.yml",
  ".github/pull_request_template.md",
  ".github/workflows/ci.yml",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/GITHUB_REPOSITORY_SETUP.md"
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(process.cwd(), file))) failures.push(`${file}: 必須の Repository 運用ファイルがありません`);
}

const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/ci.yml"), "utf8");
const actionReferences = [...workflow.matchAll(/uses:\s*([^@\s]+)@([^\s#]+)/g)];

if (!/^permissions:\s*\n\s+contents:\s*read\s*$/m.test(workflow)) {
  failures.push(".github/workflows/ci.yml: Workflow の既定権限を contents: read に固定してください");
}
if (/^\s+(?:contents|actions|checks|deployments|id-token|issues|packages|pull-requests|security-events|statuses):\s*write\s*$/m.test(workflow)) {
  failures.push(".github/workflows/ci.yml: CI に書き込み権限を付与できません");
}
if (!/persist-credentials:\s*false/.test(workflow)) {
  failures.push(".github/workflows/ci.yml: Checkout 後に Credential を残さないでください");
}
if (!/run:\s*npm ci\s*$/m.test(workflow) || !/run:\s*npm run build:vercel\s*$/m.test(workflow)) {
  failures.push(".github/workflows/ci.yml: Lock file に基づく導入と統合品質 Gate が必要です");
}
if (actionReferences.length === 0 || actionReferences.some(([, , revision]) => !/^[0-9a-f]{40}$/.test(revision))) {
  failures.push(".github/workflows/ci.yml: GitHub Actions は 40 桁の Commit SHA に固定してください");
}

const ignored = new Set(readFileSync(resolve(process.cwd(), ".gitignore"), "utf8").split(/\r?\n/).filter(Boolean));
for (const pattern of [".env", ".env.*", ".next/", ".vercel/", "node_modules/", "*.tsbuildinfo"]) {
  if (!ignored.has(pattern)) failures.push(`.gitignore: ${pattern} を Git 管理外にしてください`);
}

const codeowners = readFileSync(resolve(process.cwd(), ".github/CODEOWNERS"), "utf8");
for (const protectedPath of ["/.github/", "/scripts/", "/tests/", "/src/shared/security/", "/src/proxy.ts", "/vercel.json"]) {
  if (!codeowners.includes(`${protectedPath} @bright-broom`)) failures.push(`.github/CODEOWNERS: ${protectedPath} の Owner が未設定です`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("REPOSITORY_GOVERNANCE_OK: CI 権限、Action 固定、品質 Gate、Secret 除外、保護対象の Owner を確認しました");
}
