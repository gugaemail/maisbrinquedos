"use client";

import { useState } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

type LoginView = "login" | "forgot";

interface LoginFormProps {
  onSuccess: () => void;
}

const inputClass = (hasError?: boolean) => `
  w-full px-4 py-3 rounded-xl border text-sm font-body
  bg-white dark:bg-white/5 text-[#1A1A2E] dark:text-white
  focus:outline-none transition-colors placeholder:text-[#C4C9D9] dark:placeholder:text-white/20
  ${hasError
    ? "border-[#FF3D57] focus:border-[#FF3D57]"
    : "border-[#E2E6F0] dark:border-white/10 focus:border-[#0057FF]"
  }
`;

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { signInWithEmail, sendPasswordReset } = useCustomerAuth();

  const [view, setView] = useState<LoginView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signInWithEmail(email, password);
    setLoading(false);
    if (err) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      return;
    }
    onSuccess();
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Informe seu e-mail."); return; }
    setError("");
    setLoading(true);
    const { error: err } = await sendPasswordReset(email);
    setLoading(false);
    if (err) {
      setError("Não foi possível enviar o link. Verifique o e-mail e tente novamente.");
      return;
    }
    setResetSent(true);
  }

  if (view === "forgot") {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-lg font-display font-bold text-[#1A1A2E] dark:text-white mb-1">
            Recuperar senha
          </h3>
          <p className="text-sm text-[#6B7080] dark:text-white/50 font-body">
            Enviaremos um link para você redefinir sua senha.
          </p>
        </div>

        {resetSent ? (
          <div className="rounded-xl bg-[#00C48C]/10 border border-[#00C48C]/20 px-4 py-4">
            <p className="text-sm font-body text-[#00C48C] font-semibold">Link enviado!</p>
            <p className="text-xs font-body text-[#6B7080] dark:text-white/50 mt-1">
              Verifique sua caixa de entrada em <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgot} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="forgot-email" className="text-sm font-semibold text-[#1A1A2E] dark:text-white/80 font-body">
                E-mail
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={inputClass(!!error)}
              />
            </div>

            {error && (
              <p className="text-xs text-[#FF3D57] font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 rounded-full bg-[#0057FF] text-white font-display font-bold text-sm hover:bg-[#0046D4] hover:shadow-[0_4px_20px_rgba(0,87,255,0.4)] disabled:opacity-60 transition-all duration-200"
            >
              {loading ? "Enviando…" : "Enviar link de recuperação"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => { setView("login"); setError(""); setResetSent(false); }}
          className="flex items-center gap-1.5 text-sm text-[#6B7080] dark:text-white/50 hover:text-[#0057FF] transition-colors font-body"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-display font-bold text-[#1A1A2E] dark:text-white mb-1">
          Entrar com sua conta
        </h3>
        <p className="text-sm text-[#6B7080] dark:text-white/50 font-body">
          Seus endereços e histórico de compras estarão disponíveis.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-sm font-semibold text-[#1A1A2E] dark:text-white/80 font-body">
          E-mail
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className={inputClass(!!error)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm font-semibold text-[#1A1A2E] dark:text-white/80 font-body">
            Senha
          </label>
          <button
            type="button"
            onClick={() => { setView("forgot"); setError(""); }}
            className="text-xs text-[#0057FF] hover:underline font-body transition-colors"
          >
            Esqueci minha senha
          </button>
        </div>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass(!!error)}
        />
      </div>

      {error && (
        <p className="text-xs text-[#FF3D57] font-body flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 rounded-full bg-[#0057FF] text-white font-display font-bold text-base hover:bg-[#0046D4] hover:shadow-[0_4px_20px_rgba(0,87,255,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Entrando…
          </>
        ) : (
          "Entrar →"
        )}
      </button>
    </form>
  );
}
