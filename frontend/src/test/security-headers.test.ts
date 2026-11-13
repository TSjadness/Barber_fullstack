// @vitest-environment node
import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS, withSecurityHeaders } from "@/lib/security-headers";

describe("cabeçalhos de segurança do servidor", () => {
  it("aplica os cabeçalhos e HSTS apenas em HTTPS", () => {
    const https = withSecurityHeaders(new Response("ok"), new Request("https://exemplo.com/"));
    for (const [name, value] of Object.entries(SECURITY_HEADERS))
      expect(https.headers.get(name)).toBe(value);
    expect(https.headers.get("Strict-Transport-Security")).toMatch(/max-age=\d+/);

    const local = withSecurityHeaders(new Response("ok"), new Request("http://localhost:8080/"));
    expect(local.headers.get("X-Frame-Options")).toBe("DENY");
    expect(local.headers.get("Strict-Transport-Security")).toBeNull();
  });

  it("não sobrescreve cabeçalhos já definidos pela resposta", () => {
    const res = new Response("ok", { headers: { "Referrer-Policy": "no-referrer" } });
    expect(
      withSecurityHeaders(res, new Request("http://localhost/")).headers.get("Referrer-Policy"),
    ).toBe("no-referrer");
  });

  it("copia respostas com cabeçalhos imutáveis", async () => {
    const immutable = Response.redirect("http://localhost/destino", 302);
    const out = withSecurityHeaders(immutable, new Request("http://localhost/"));
    expect(out.status).toBe(302);
    expect(out.headers.get("Location")).toBe("http://localhost/destino");
    expect(out.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("CSP não restringe scripts e estilos inline (hidratação e styled-components)", () => {
    const csp = SECURITY_HEADERS["Content-Security-Policy"] ?? "";
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toMatch(/script-src|style-src|default-src/);
  });
});
