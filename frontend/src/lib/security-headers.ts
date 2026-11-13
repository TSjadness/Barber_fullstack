/**
 * Cabeçalhos de segurança aplicados a todas as respostas do servidor (páginas, server
 * functions e erros). A CSP é só a parte que não depende de scripts/estilos: o
 * TanStack Start injeta scripts inline de hidratação e o styled-components injeta
 * estilos inline, então `script-src`/`style-src` restritivos quebrariam a página.
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Content-Security-Policy": "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

/** HSTS só em HTTPS (Vercel); em http://localhost o navegador ignoraria ou atrapalharia. */
const HSTS = "max-age=63072000; includeSubDomains";

export function withSecurityHeaders(response: Response, request: Request): Response {
  const https = new URL(request.url).protocol === "https:";
  const apply = (headers: Headers) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS))
      if (!headers.has(name)) headers.set(name, value);
    if (https && !headers.has("Strict-Transport-Security"))
      headers.set("Strict-Transport-Security", HSTS);
  };
  try {
    apply(response.headers);
    return response;
  } catch {
    // Cabeçalhos imutáveis (ex.: resposta repassada de um fetch): copia a resposta.
    const copy = new Response(response.body, response);
    apply(copy.headers);
    return copy;
  }
}
