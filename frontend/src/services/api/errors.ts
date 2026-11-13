/** Erro da API com o status HTTP e a indicação de falha de rede (sem resposta do servidor). */
export class ApiError extends Error {
  status: number | undefined;
  network: boolean;
  constructor(message: string, options: { status?: number; network?: boolean } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.network = options.network ?? false;
  }
}

export const NETWORK_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

/** Falha passageira: sem rede, tempo esgotado, servidor sobrecarregado ou erro 5xx. */
export const isTransient = (e: unknown) =>
  e instanceof ApiError &&
  (e.network || e.status === 408 || e.status === 429 || (e.status ?? 0) >= 500);

/** Qualquer erro vindo do fetch/servidor (sem ApiError) que na prática é falta de conexão. */
export function asApiError(e: unknown): Error {
  if (e instanceof ApiError) return e;
  const message = e instanceof Error ? e.message : String(e);
  if (
    e instanceof TypeError ||
    /failed to fetch|networkerror|load failed|network request/i.test(message)
  )
    return new ApiError(NETWORK_MESSAGE, { network: true });
  // O middleware de autenticação responde "Unauthorized: ..." em inglês: vira sessão expirada (401).
  if (/^unauthorized/i.test(message))
    return new ApiError("Sua sessão expirou. Entre novamente.", { status: 401 });
  return e instanceof Error ? e : new Error(message);
}

export const statusOf = (e: unknown) => (e instanceof ApiError ? e.status : undefined);

export const isNetworkError = (e: unknown) => e instanceof ApiError && e.network;

export const messageOf = (e: unknown) => (e instanceof Error ? e.message : String(e ?? ""));

/** Converte mensagens de autenticação do Supabase (em inglês) para português. */
export function authErrorPt(raw: string): string {
  const m = raw.toLowerCase();
  const rules: [RegExp, string][] = [
    [
      /email address .* is invalid|invalid email|unable to validate email/,
      "E-mail inválido. Confira o endereço digitado.",
    ],
    [/invalid login credentials/, "E-mail ou senha incorretos."],
    [
      /email not confirmed/,
      "E-mail ainda não confirmado. Confirme pelo link enviado ao seu e-mail.",
    ],
    [/user already registered|already been registered/, "Este e-mail já está cadastrado."],
    [
      /password should be at least|password is too short|weak password/,
      "A senha é muito curta ou fraca. Use pelo menos 6 caracteres.",
    ],
    [
      /rate limit|too many requests|over_email_send_rate_limit|security purposes/,
      "Muitas tentativas. Aguarde um pouco e tente novamente.",
    ],
    [/signups? not allowed|signup is disabled/, "O cadastro de novas contas está desativado."],
    [/same password|different from the old/, "A nova senha precisa ser diferente da atual."],
    [
      /token has expired|otp.*expired|invalid or has expired/,
      "Código inválido ou expirado. Solicite um novo código.",
    ],
    [/user not found/, "Usuário não encontrado."],
    [/failed to fetch|network|fetch failed/, NETWORK_MESSAGE],
  ];
  for (const [re, pt] of rules) if (re.test(m)) return pt;
  return "Não foi possível concluir. Tente novamente em instantes.";
}
