export function createContentSecurityPolicy(nonce: string, isDevelopment: boolean) {
  const developmentScriptPolicy = isDevelopment ? " 'unsafe-eval'" : "";
  const developmentConnectPolicy = isDevelopment ? " ws: http: https:" : "";
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic'" + developmentScriptPolicy,
    "style-src 'self' 'nonce-" + nonce + "'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'" + developmentConnectPolicy,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ];
  if (!isDevelopment) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}
