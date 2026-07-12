export function inspectWebAddress(value: string, trustedHost: string) { try { const url = new URL(value); const scheme = url.protocol.replace(":", ""); const valid = scheme === "https" || scheme === "http"; return { valid, scheme, host: url.hostname, path: `${url.pathname}${url.search}`, trustedHost: valid && url.hostname === trustedHost }; } catch { return { valid: false, scheme: "", host: "", path: "", trustedHost: false }; } }

export function resolveVirtualHost(host: string): string | null {
  const normalized = host.trim().toLowerCase();
  if (!normalized.includes(".") || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(normalized)) return null;
  const finalOctet = [...normalized].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 253, 0) + 1;
  return `192.0.2.${finalOctet}`;
}
