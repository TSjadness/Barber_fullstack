import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BarberDataContext,
  type BarberDataValue,
  type LoadStatus,
  type SaveOptions,
} from "./context";
import { useNavigation } from "@/hooks/useNavigation";
import { notify, notifyError } from "@/scripts/notifications";
import { IS_MOCK, isNetworkError, messageOf, statusOf } from "@/services/api";
import * as auth from "@/services/authService";
import { fetchAdminState, fetchPublicState, saveAdminState } from "@/services/stateService";
import type { AppState } from "@/types/barber";

const SESSION_EXPIRED = "Sua sessão expirou. Entre novamente para continuar.";

export function BarberDataProvider({ children }: { children: ReactNode }) {
  const { setView, startView } = useNavigation();
  const [db, setDbState] = useState<AppState | null>(null);
  const [token, setTokenState] = useState("");
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [loadError, setLoadError] = useState("");

  // Refs com o valor mais recente para as rotinas assíncronas (fila de gravação, sessão).
  const dbRef = useRef<AppState | null>(null);
  const tokenRef = useRef("");
  const writeQueue = useRef<Promise<void>>(Promise.resolve());
  /** Versão do estado no servidor (controle otimista): enviada em cada gravação. */
  const versionRef = useRef<string | undefined>(undefined);
  /** Muda quando uma gravação é recusada por conflito: as gravações já enfileiradas são descartadas. */
  const generationRef = useRef(0);

  const setDb = useCallback((next: AppState) => {
    dbRef.current = next;
    setDbState(next);
  }, []);
  /** Estado recém-lido do servidor: passa a ser a base (e a versão) das próximas gravações. */
  const loadDb = useCallback(
    (next: AppState) => {
      versionRef.current = next.version;
      setDb(next);
    },
    [setDb],
  );
  const setToken = useCallback((next: string) => {
    tokenRef.current = next;
    setTokenState(next);
  }, []);

  /** Sessão recusada pelo servidor (401): volta ao site público em vez de ficar numa tela quebrada. */
  const sessionExpired = useCallback(async () => {
    setToken("");
    setView("public");
    try {
      await auth.logout();
    } catch {
      /* a sessão já não é válida no servidor */
    }
    loadDb(await fetchPublicState());
    setStatus("ready");
    // Adiado: um aviso disparado junto da troca de tela é descartado pela troca.
    setTimeout(() => notify(SESSION_EXPIRED), 300);
  }, [loadDb, setToken, setView]);

  const refreshState = useCallback(async () => {
    try {
      loadDb(tokenRef.current ? await fetchAdminState() : await fetchPublicState());
    } catch (e) {
      if (tokenRef.current && statusOf(e) === 401) return sessionExpired();
      throw e;
    }
    setStatus("ready");
  }, [loadDb, sessionExpired]);

  /** Grava o estado completo em fila, na ordem das alterações. */
  const save = useCallback(
    (next: AppState, options?: SaveOptions) => {
      if (!tokenRef.current) {
        notifyError("Faça login para editar dados.");
        return;
      }
      const deletedBookingIds = options?.deletedBookingIds ?? [];
      const payload: Record<string, unknown> = deletedBookingIds.length
        ? { ...next, deletedBookingIds }
        : { ...next };
      const generation = generationRef.current;
      writeQueue.current = writeQueue.current
        .then(async () => {
          // Gravação feita sobre um estado já recusado por conflito: descartada.
          if (generation !== generationRef.current) return;
          // A versão é lida na hora do envio: gravações em fila usam a versão da anterior.
          const version = await saveAdminState(
            JSON.stringify({ ...payload, version: versionRef.current }),
          );
          if (version) versionRef.current = version;
        })
        .catch(async (e: unknown) => {
          if (statusOf(e) === 409) {
            // Outra aba/aparelho gravou antes: nada foi salvo. Descarta a fila e recarrega.
            generationRef.current++;
            notifyError(messageOf(e));
            try {
              await refreshState();
            } catch {
              /* mantém os dados atuais na tela */
            }
            return;
          }
          if (statusOf(e) === 401) {
            try {
              await sessionExpired();
            } catch {
              /* sem conexão: o aviso de erro já foi exibido */
            }
            return;
          }
          notify(
            isNetworkError(e)
              ? "Sem conexão: não foi possível salvar. Tente novamente em instantes."
              : "Erro ao salvar: " + messageOf(e),
          );
          try {
            await refreshState();
          } catch {
            /* mantém os dados atuais na tela */
          }
        });
    },
    [refreshState, sessionExpired],
  );

  const updateLocal = useCallback(
    (recipe: (draft: AppState) => void) => {
      if (!dbRef.current) return;
      const draft = structuredClone(dbRef.current);
      recipe(draft);
      setDb(draft);
    },
    [setDb],
  );
  const update = useCallback(
    (recipe: (draft: AppState) => void, options?: SaveOptions) => {
      if (!dbRef.current) return;
      const draft = structuredClone(dbRef.current);
      recipe(draft);
      setDb(draft);
      save(draft, options);
    },
    [save, setDb],
  );

  const reloadPublic = useCallback(async () => loadDb(await fetchPublicState()), [loadDb]);

  const login = useCallback(
    async (email: string, password: string) => {
      setToken(await auth.login({ email, password }));
      await refreshState();
      setView("admin");
    },
    [refreshState, setToken, setView],
  );

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      /* sair sempre encerra a sessão local */
    }
    setToken("");
    setView("public");
    await refreshState();
  }, [refreshState, setToken, setView]);

  // Carga inicial (uma única vez): valida a sessão salva e busca o estado (completo ou público).
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    (async () => {
      const hasSession = await auth.hasStoredSession();
      setToken(hasSession && startView !== "reset-link" ? "session" : "");
      if (!tokenRef.current) return refreshState();
      try {
        loadDb(await fetchAdminState());
        setStatus("ready");
      } catch (e) {
        if (statusOf(e) !== 401) throw e;
        if (!IS_MOCK) return sessionExpired();
        // Modo local: sessão recusada é descartada sem aviso e o site abre como visitante.
        auth.clearStoredSession();
        setToken("");
        await refreshState();
      }
    })().catch((e: unknown) => {
      setLoadError(messageOf(e));
      setStatus("error");
    });
  }, [loadDb, refreshState, sessionExpired, setToken, startView]);

  const value = useMemo<BarberDataValue>(
    () => ({ db, token, status, loadError, update, updateLocal, reloadPublic, login, logout }),
    [db, token, status, loadError, update, updateLocal, reloadPublic, login, logout],
  );
  return <BarberDataContext.Provider value={value}>{children}</BarberDataContext.Provider>;
}
