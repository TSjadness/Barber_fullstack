/**
 * Funcionalidade: Notificações (toasts)
 *
 * Responsabilidade:
 * Padronizar as mensagens exibidas ao usuário: esconder detalhes técnicos de erros,
 * classificar a mensagem como erro ou informação e, no mobile, suprimir avisos
 * informativos (que se sobrepõem à tela) mantendo sempre os alertas de erro.
 *
 * Origem:
 * Função `toast` anteriormente implementada no arquivo public/barber/app.js, que
 * repassava a mensagem ao react-toastify por meio do evento `barber:toast`.
 */
import { toast } from "react-toastify";
import { MOBILE_QUERY } from "@/constants/barber";

const TECHNICAL_ERROR =
  /(?:is not defined|undefined|null|TypeError|ReferenceError|SyntaxError|Error:|stack|SQLITE_|internal server error|fetch failed)/i;
const IMPORTANT_MESSAGE =
  /(erro|falha|não foi possível|inválid|indispon|reservado|expirou|sem conexão|ocorreu um erro|não pode|não é possível|cancele ou transfira|confira)/i;
const ERROR_MESSAGE =
  /(erro|falha|não foi possível|inválid|indispon|reservado|expirou|sem conexão)/i;

/** Texto final mostrado ao usuário (mensagens técnicas viram um aviso genérico). */
export function friendlyMessage(text: unknown) {
  const message = String(text || "");
  return TECHNICAL_ERROR.test(message)
    ? "Ocorreu um erro no sistema. Tente novamente em instantes."
    : message;
}

export const isErrorMessage = (message: string) => ERROR_MESSAGE.test(message);

/**
 * Exibe uma notificação. `forceVisible` mostra o aviso também no mobile, onde
 * mensagens informativas são normalmente omitidas.
 */
export function notify(text: unknown, forceVisible = false) {
  const message = friendlyMessage(text);
  const mobile = typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
  if (mobile && !IMPORTANT_MESSAGE.test(message) && !forceVisible) return;
  if (isErrorMessage(message)) toast.error(message);
  else toast.info(message);
}

/**
 * Erro de validação (dado incompleto, horário bloqueado, conflito...). É sempre exibido,
 * inclusive no mobile, e com o estilo de erro: sem ele a ação "não faria nada" no celular.
 */
export function notifyError(text: unknown) {
  toast.error(friendlyMessage(text));
}
