import { useState } from "react";
import { Button } from "@/components/Button";
import { Form } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { useBarberData } from "@/hooks/useBarberData";
import { useNavigation } from "@/hooks/useNavigation";
import { useOverlay } from "@/hooks/useOverlay";
import { notify } from "@/scripts/notifications";
import { messageOf } from "@/services/api";

/**
 * Credenciais de demonstração do backend local, preenchidas só em desenvolvimento
 * (`vite dev`). No build de produção `import.meta.env.DEV` vira `false` e o minificador
 * remove os textos: o bundle público não carrega e-mail nem senha (ver
 * src/test/secrets.test.ts).
 */
const DEFAULT_EMAIL = import.meta.env.DEV ? "admin@rafaeluzeda.com" : "";
const DEFAULT_PASSWORD = import.meta.env.DEV ? "Barbearia@2026" : "";

export function LoginForm() {
  const { login } = useBarberData();
  const { setAuthMode, setResetEmail } = useNavigation();
  const { showBusy, closeModal } = useOverlay();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);

  const submit = async () => {
    showBusy("Entrando na gestão", "Verificando seu acesso, aguarde um instante...");
    try {
      await login(email, password);
      closeModal();
    } catch (e) {
      closeModal();
      notify(messageOf(e));
    }
  };

  return (
    <>
      <span className="eyebrow">Acesso restrito</span>
      <h1 style={{ marginTop: 12 }}>Entrar na gestão</h1>
      <p className="muted">Apenas o proprietário pode alterar a agenda.</p>
      <Form onSubmit={submit}>
        <label>
          E-mail
          <input
            type="email"
            id="loginEmail"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha
          <input
            id="loginPassword"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button variant="primary" type="submit">
          Entrar no painel <Icon name="arrowRight" />
        </Button>
      </Form>
      <button
        className="auth-link"
        onClick={() => {
          setResetEmail(email);
          setAuthMode("forgot");
        }}
      >
        Esqueceu a senha?
      </button>
    </>
  );
}
