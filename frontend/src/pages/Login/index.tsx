import { ForgotForm } from "./components/ForgotForm";
import { LoginForm } from "./components/LoginForm";
import { ResetForm } from "./components/ResetForm";
import { Card } from "@/components/Card";
import { useNavigation } from "@/hooks/useNavigation";

const layout = { maxWidth: 440, margin: "70px auto", padding: 25 } as const;

/** Acesso restrito à gestão: login, pedido de código e redefinição de senha. */
export function LoginPage() {
  const { authMode } = useNavigation();
  return (
    <main style={layout}>
      <Card className="auth-card bf-enter">
        {authMode === "forgot" ? (
          <ForgotForm />
        ) : authMode === "reset" ? (
          <ResetForm />
        ) : (
          <LoginForm />
        )}
      </Card>
    </main>
  );
}
