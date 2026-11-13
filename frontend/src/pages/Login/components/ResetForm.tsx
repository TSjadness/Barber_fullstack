import { useState } from "react";
import { Button } from "@/components/Button";
import { Form } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { useNavigation } from "@/hooks/useNavigation";
import { useOverlay } from "@/hooks/useOverlay";
import { notify, notifyError } from "@/scripts/notifications";
import { messageOf } from "@/services/api";
import { resetPassword } from "@/services/authService";

/**
 * Nova senha. Pelo código enviado por e-mail pede e-mail + código; pelo link de
 * recuperação do Supabase (`reset-link`) a sessão temporária já identifica a conta.
 */
export function ResetForm() {
  const { resetEmail, startView, setStartView, setAuthMode } = useNavigation();
  const { showBusy, closeModal } = useOverlay();
  const link = startView === "reset-link";
  const [email, setEmail] = useState(resetEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const submit = async () => {
    const address = email.trim() || resetEmail;
    const otp = code.trim();
    if (password !== confirmation) return notifyError("As senhas não conferem.");
    if (password.length < 6)
      return notifyError("A nova senha precisa ter pelo menos 6 caracteres.");
    if (!link && !otp) return notifyError("Informe o código recebido por e-mail.");
    showBusy("Alterando senha", "Aguarde um instante...");
    try {
      await resetPassword({ email: address, code: otp, password });
      closeModal();
      setStartView("admin");
      window.history.replaceState(null, "", "/login");
      setAuthMode("login");
      notify("Senha alterada com sucesso. Entre com a nova senha.");
    } catch (e) {
      closeModal();
      notify(messageOf(e));
    }
  };

  return (
    <>
      <span className="eyebrow">Nova senha</span>
      <h1 style={{ marginTop: 12 }}>Redefinir senha</h1>
      <p className="muted">
        {link
          ? "Crie sua nova senha abaixo."
          : "Digite o código que chegou no seu e-mail e escolha a nova senha."}
      </p>
      <Form onSubmit={submit}>
        {!link && (
          <>
            <label>
              E-mail
              <input
                type="email"
                id="rsEmail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Código recebido
              <input
                id="rsCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={10}
                required
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
          </>
        )}
        <label>
          Nova senha
          <input
            id="rsPass"
            type="password"
            minLength={6}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Confirmar nova senha
          <input
            id="rsPass2"
            type="password"
            minLength={6}
            required
            autoComplete="new-password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </label>
        <Button variant="primary" type="submit">
          Alterar senha <Icon name="check" />
        </Button>
      </Form>
      <div className="auth-row">
        {!link && (
          <button className="auth-link" onClick={() => setAuthMode("forgot")}>
            Reenviar código
          </button>
        )}
        <button className="auth-link" onClick={() => setAuthMode("login")}>
          Voltar para o login
        </button>
      </div>
    </>
  );
}
