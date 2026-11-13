import { useState } from "react";
import { Button } from "@/components/Button";
import { Form } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { useNavigation } from "@/hooks/useNavigation";
import { useOverlay } from "@/hooks/useOverlay";
import { notify, notifyError } from "@/scripts/notifications";
import { messageOf } from "@/services/api";
import { sendResetCode } from "@/services/authService";

/** Pedido do código de recuperação de senha por e-mail. */
export function ForgotForm() {
  const { resetEmail, setResetEmail, setAuthMode } = useNavigation();
  const { showBusy, closeModal } = useOverlay();
  const [email, setEmail] = useState(resetEmail);

  const submit = async () => {
    const address = email.trim();
    if (!address) return notifyError("Informe seu e-mail.");
    showBusy("Enviando código", "Aguarde um instante...");
    try {
      await sendResetCode(address);
      setResetEmail(address);
      closeModal();
      setAuthMode("reset");
      notify("Enviamos um código para " + address);
    } catch (e) {
      closeModal();
      notify(messageOf(e));
    }
  };

  return (
    <>
      <span className="eyebrow">Recuperar acesso</span>
      <h1 style={{ marginTop: 12 }}>Esqueceu a senha?</h1>
      <p className="muted">
        Informe o e-mail cadastrado. Vamos enviar um código para você criar uma nova senha.
      </p>
      <Form onSubmit={submit}>
        <label>
          E-mail
          <input
            type="email"
            id="fgEmail"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <Button variant="primary" type="submit">
          Enviar código <Icon name="arrowRight" />
        </Button>
      </Form>
      <button className="auth-link" onClick={() => setAuthMode("login")}>
        Voltar para o login
      </button>
    </>
  );
}
