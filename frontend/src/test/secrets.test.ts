// @vitest-environment node
/**
 * Detecta credenciais expostas no código público e no bundle de produção.
 *
 * - Credenciais de demonstração: o teste guarda só o SHA-256 delas (nunca o texto) e
 *   compara com cada "palavra" dos arquivos. No código-fonte só podem aparecer atrás de
 *   `import.meta.env.DEV`; no bundle de produção, em lugar nenhum.
 * - Segredos genéricos: chave privada PEM, JWT com papel `service_role`, chaves secretas
 *   do Supabase/Stripe e os valores das variáveis secretas do `.env` local (comparados em
 *   memória; as mensagens de falha citam só o nome da variável e o arquivo).
 *
 * A parte do bundle roda quando `.output/` existe: execute `npm run build` antes para
 * validar o build atual (`npm run test:secrets` faz os dois).
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");
const SRC = join(ROOT, "src");
const OUTPUT = join(ROOT, ".output");

/** SHA-256 do e-mail e da senha de demonstração do backend local. */
const DEMO_CREDENTIAL_HASHES = new Set([
  "2f13f69538668551b480adfec071c90ca76f568e32ea35c0bec538cbbc1d1641",
  "b3dfffca634178e470afdae2294920ea1ac6f14923975bc1bf63ae0f5719ae14",
]);
/** Único arquivo autorizado a conter as credenciais, e só atrás de `import.meta.env.DEV`. */
const DEV_ONLY_FILE = join(SRC, "pages/Login/components/LoginForm.tsx");

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".json",
  ".html",
  ".css",
  ".txt",
  ".map",
  ".svg",
]);
const SECRET_ENV_NAME = /SERVICE_ROLE|SECRET|PASSWORD|PRIVATE|DATABASE_URL|_TOKEN$/i;

function walk(dir: string, skip: (path: string) => boolean = () => false): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (skip(path)) continue;
    if (statSync(path).isDirectory()) out.push(...walk(path, skip));
    else if (TEXT_EXT.has(extname(name))) out.push(path);
  }
  return out;
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Palavras com os caracteres possíveis de e-mail/senha; cada uma é comparada pelo hash. */
function demoCredentialHits(text: string): number {
  const tokens = new Set(
    text.split(/[^A-Za-z0-9@._+\-!#$%&*]+/).filter((t) => t.length >= 6 && t.length <= 128),
  );
  let hits = 0;
  for (const token of tokens) if (DEMO_CREDENTIAL_HASHES.has(sha256(token))) hits++;
  return hits;
}

function decodeJwtRole(jwt: string): unknown {
  try {
    const payload = jwt.split(".")[1] ?? "";
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))?.role;
  } catch {
    return undefined;
  }
}

/** Nomes dos padrões de segredo encontrados (nunca o valor). */
function genericSecretFindings(text: string): string[] {
  const found: string[] = [];
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text)) found.push("chave privada PEM");
  if (/\bsb_secret_[A-Za-z0-9_-]{10,}/.test(text)) found.push("chave secreta do Supabase");
  if (/\bsk_(live|test)_[A-Za-z0-9]{10,}/.test(text)) found.push("chave secreta Stripe");
  for (const [jwt] of text.matchAll(/eyJ[\w-]{10,}\.eyJ[\w-]{10,}\.[\w-]+/g))
    if (decodeJwtRole(jwt) === "service_role") found.push("JWT service_role");
  return found;
}

/** Variáveis secretas do `.env` local (nome → valor), só para comparação em memória. */
function secretEnvValues(): [string, string][] {
  const file = join(ROOT, ".env");
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => /^\s*([A-Z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/.exec(line))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => [m[1] ?? "", m[2] ?? ""] as [string, string])
    .filter(
      ([name, value]) =>
        !name.startsWith("VITE_") && SECRET_ENV_NAME.test(name) && value.length >= 8,
    );
}

const rel = (path: string) => relative(ROOT, path).replace(/\\/g, "/");

describe("credenciais no código público", () => {
  const files = [
    ...walk(SRC, (p) => p.startsWith(join(SRC, "test"))),
    ...walk(join(ROOT, "public")),
  ];

  it("encontra arquivos para analisar", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it("credenciais de demonstração só no LoginForm e atrás de import.meta.env.DEV", () => {
    const offenders = files.filter(
      (f) => f !== DEV_ONLY_FILE && demoCredentialHits(readFileSync(f, "utf8")) > 0,
    );
    expect(offenders.map(rel)).toEqual([]);

    // No LoginForm, toda linha com credencial precisa estar condicionada ao ambiente de desenvolvimento.
    const unguarded = readFileSync(DEV_ONLY_FILE, "utf8")
      .split(/\r?\n/)
      .filter((line) => demoCredentialHits(line) > 0 && !/import\.meta\.env\.DEV\s*\?/.test(line));
    expect(unguarded.length).toBe(0);
  });

  it("sem chaves privadas, service_role ou chaves secretas", () => {
    const findings = files.flatMap((f) =>
      genericSecretFindings(readFileSync(f, "utf8")).map((k) => `${rel(f)}: ${k}`),
    );
    expect(findings).toEqual([]);
  });

  it("valores secretos do .env local não aparecem no código", () => {
    const secrets = secretEnvValues();
    const leaks = files.flatMap((f) => {
      const text = readFileSync(f, "utf8");
      return secrets
        .filter(([, value]) => text.includes(value))
        .map(([name]) => `${rel(f)}: ${name}`);
    });
    expect(leaks).toEqual([]);
  });
});

describe.skipIf(!existsSync(OUTPUT))("credenciais no bundle de produção (.output)", () => {
  // Cliente (public) e servidor; dependências copiadas para .output/server/node_modules ficam de fora.
  const files = walk(OUTPUT, (p) => p.includes(`${join("server", "node_modules")}`));

  it("bundle encontrado", () => {
    expect(files.some((f) => f.startsWith(join(OUTPUT, "public")))).toBe(true);
  });

  it("sem credenciais de demonstração", () => {
    const offenders = files.filter((f) => demoCredentialHits(readFileSync(f, "utf8")) > 0);
    expect(offenders.map(rel)).toEqual([]);
  });

  it("sem chaves privadas, service_role, chaves secretas ou valores secretos do .env", () => {
    const secrets = secretEnvValues();
    const findings = files.flatMap((f) => {
      const text = readFileSync(f, "utf8");
      return [
        ...genericSecretFindings(text),
        ...secrets.filter(([, value]) => text.includes(value)).map(([name]) => name),
      ].map((k) => `${rel(f)}: ${k}`);
    });
    expect(findings).toEqual([]);
  });
});
