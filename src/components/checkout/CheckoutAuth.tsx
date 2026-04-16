"use client";

import { useState } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import LoginForm from "./LoginForm";

export type AuthMode = "guest" | "social" | "login";

interface CheckoutAuthProps {
  onSelect: (mode: AuthMode) => void;
}

// ─── Social loading overlay ───────────────────────────────────────────────────

function SocialLoadingOverlay({ provider }: { provider: "Google" | "Apple" }) {
  return (
    <div className="absolute inset-0 rounded-2xl flex items-center justify-center gap-2.5 bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm z-10">
      <svg className="w-4 h-4 text-[#0057FF] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
      <span className="text-sm font-body text-[#1A1A2E] dark:text-white">
        Redirecionando para o {provider}…
      </span>
    </div>
  );
}

// ─── Option card ──────────────────────────────────────────────────────────────

function OptionCard({
  icon,
  title,
  description,
  badge,
  onClick,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left
        border-[#E2E6F0] dark:border-white/10 bg-white dark:bg-white/5
        hover:border-[#0057FF] hover:bg-[#0057FF]/5 hover:shadow-[0_0_0_2px_rgba(0,87,255,0.15)]
        disabled:opacity-60 disabled:cursor-wait
        transition-all duration-200 cursor-pointer"
    >
      <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
        bg-[#F0F4FF] dark:bg-white/10 text-[#0057FF] dark:text-white
        group-hover:bg-[#0057FF] group-hover:text-white transition-colors duration-200">
        {icon}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-display font-bold text-[#1A1A2E] dark:text-white">
            {title}
          </span>
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full font-body bg-[#00C48C]/10 text-[#00C48C]">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-[#6B7080] dark:text-white/50 font-body mt-0.5 line-clamp-1">
          {description}
        </p>
      </div>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 flex-shrink-0 text-[#C4C9D9] dark:text-white/20
          group-hover:text-[#0057FF] group-hover:translate-x-0.5 transition-all duration-200"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const GuestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function CheckoutAuth({ onSelect }: CheckoutAuthProps) {
  const { signInWithGoogle } = useCustomerAuth();
  const [view, setView] = useState<"options" | "login">("options");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleGoogle() {
    setGoogleLoading(true);
    setAuthError("");
    try {
      await signInWithGoogle("/checkout");
      // Page redirects — no need to setLoading(false)
    } catch {
      setGoogleLoading(false);
      setAuthError("Não foi possível iniciar o login com Google. Tente novamente.");
    }
  }

  function handleLoginSuccess() {
    onSelect("login");
  }

  if (view === "login") {
    return (
      <div className="w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={() => { setView("options"); setAuthError(""); }}
          className="flex items-center gap-1.5 text-sm text-[#6B7080] dark:text-white/50 hover:text-[#0057FF] transition-colors font-body mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Outras opções
        </button>
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      {googleLoading && <SocialLoadingOverlay provider="Google" />}

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0057FF]/10 mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0057FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-extrabold text-[#1A1A2E] dark:text-white mb-1">
          Como deseja continuar?
        </h2>
        <p className="text-sm text-[#6B7080] dark:text-white/50 font-body">
          Seus dados são protegidos pela LGPD e nunca serão compartilhados sem sua autorização.
        </p>
      </div>

      {authError && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-[#FF3D57]/10 border border-[#FF3D57]/20 text-sm text-[#FF3D57] font-body">
          {authError}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <OptionCard
          icon={<GuestIcon />}
          title="Continuar sem cadastro"
          description="Compre rápido sem criar uma conta. Você pode criar uma senha depois."
          badge="Mais rápido"
          onClick={() => onSelect("guest")}
        />

        <OptionCard
          icon={<GoogleIcon />}
          title="Entrar com Google"
          description="Preencha seus dados automaticamente com sua conta Google."
          onClick={handleGoogle}
          loading={googleLoading}
        />

        <OptionCard
          icon={<EmailIcon />}
          title="Entrar com e-mail e senha"
          description="Use sua conta existente para recuperar endereços e histórico de compras."
          onClick={() => setView("login")}
        />
      </div>

      <p className="text-center text-xs text-[#6B7080] dark:text-white/40 font-body mt-6 leading-relaxed">
        Ao continuar, você concorda com nossos{" "}
        <a href="/termos" className="underline hover:text-[#0057FF] transition-colors">Termos de Uso</a>
        {" "}e{" "}
        <a href="/privacidade" className="underline hover:text-[#0057FF] transition-colors">Política de Privacidade</a>.
      </p>
    </div>
  );
}
