import { describe, expect, it } from "vitest";

import { createContentSecurityPolicy } from "@/shared/security/content-security-policy";

describe("content security policy", () => {
  it("production では nonce を要求して eval と外部接続を許可しない", () => {
    const policy = createContentSecurityPolicy("test-nonce", false);
    expect(policy).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic'");
    expect(policy).toContain("connect-src 'self'");
    expect(policy).toContain("upgrade-insecure-requests");
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).not.toContain("connect-src 'self' https:");
  });

  it("development の HMR に必要な接続だけを開発時に許可する", () => {
    const policy = createContentSecurityPolicy("dev-nonce", true);
    expect(policy).toContain("'unsafe-eval'");
    expect(policy).toContain("ws: http: https:");
    expect(policy).not.toContain("upgrade-insecure-requests");
  });
});
