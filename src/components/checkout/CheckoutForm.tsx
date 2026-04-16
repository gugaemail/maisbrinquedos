"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCEP } from "@/hooks/useCEP";
import type { AuthMode } from "./CheckoutAuth";

// ─── Zod schemas por etapa ────────────────────────────────────────────────────

const personalSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido — use o formato 000.000.000-00")
    .refine(validateCPF, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido — use (00) 00000-0000"),
});

const addressSchema = z.object({
  zip: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  street: z.string().min(3, "Logradouro obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "UF inválida"),
});

const consentSchema = z.object({
  termsAccepted: z.boolean().refine((v) => v, "Você precisa aceitar os termos para continuar"),
  consentMarketingEmail: z.boolean(),
  consentMarketingWhatsapp: z.boolean(),
});

export type PersonalData = z.infer<typeof personalSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type ConsentData = z.infer<typeof consentSchema>;

export interface CheckoutData {
  personal: PersonalData;
  address: AddressData;
  consent: ConsentData;
}

// ─── CPF validation ───────────────────────────────────────────────────────────

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10 || check === 11) check = 0;
  if (check !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10 || check === 11) check = 0;
  return check === parseInt(digits[10]);
}

// ─── Masking helpers ──────────────────────────────────────────────────────────

function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function maskCEP(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Dados pessoais", "Endereço", "Confirmação"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold
              transition-all duration-300
              ${i < current
                ? "bg-[#0057FF] text-white"
                : i === current
                  ? "bg-[#0057FF] text-white ring-4 ring-[#0057FF]/20"
                  : "bg-[#E2E6F0] dark:bg-white/10 text-[#6B7080] dark:text-white/40"
              }
            `}>
              {i < current ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`
              text-[10px] font-body mt-1 text-center leading-tight hidden sm:block
              ${i === current ? "text-[#0057FF] font-semibold" : "text-[#6B7080] dark:text-white/40"}
            `}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`
              flex-1 h-0.5 mx-2 mb-4 sm:mb-5 transition-all duration-300
              ${i < current ? "bg-[#0057FF]" : "bg-[#E2E6F0] dark:bg-white/10"}
            `} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[#1A1A2E] dark:text-white/80 font-body">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-[#6B7080] dark:text-white/40 font-body">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-[#FF3D57] font-body flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError?: boolean) => `
  px-4 py-3 rounded-xl border text-sm font-body
  bg-white dark:bg-white/5 text-[#1A1A2E] dark:text-white
  focus:outline-none transition-colors placeholder:text-[#C4C9D9] dark:placeholder:text-white/20
  ${hasError
    ? "border-[#FF3D57] focus:border-[#FF3D57]"
    : "border-[#E2E6F0] dark:border-white/10 focus:border-[#0057FF]"
  }
`;

// ─── Step 1: Personal data ────────────────────────────────────────────────────

function StepPersonal({
  defaultValues,
  onNext,
  authMode,
}: {
  defaultValues?: Partial<PersonalData>;
  onNext: (data: PersonalData) => void;
  authMode: AuthMode;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues,
  });

  const cpfValue = watch("cpf") ?? "";
  const phoneValue = watch("phone") ?? "";

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <p className="text-xs font-body text-[#6B7080] dark:text-white/50 bg-[#F8F9FC] dark:bg-white/5 rounded-xl px-4 py-3 leading-relaxed">
        <strong className="text-[#1A1A2E] dark:text-white">Base legal LGPD:</strong> estes dados são necessários
        para emissão de nota fiscal e entrega do pedido (Art. 7º, V — execução de contrato).
      </p>

      <Field label="Nome completo" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="João da Silva"
          className={inputClass(!!errors.name)}
          {...register("name")}
        />
      </Field>

      <Field label="CPF" htmlFor="cpf" error={errors.cpf?.message} hint="Obrigatório para emissão de nota fiscal">
        <input
          id="cpf"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="000.000.000-00"
          maxLength={14}
          className={inputClass(!!errors.cpf)}
          value={cpfValue}
          onChange={(e) => setValue("cpf", maskCPF(e.target.value), { shouldValidate: cpfValue.length >= 13 })}
        />
      </Field>

      <Field label="E-mail" htmlFor="email" error={errors.email?.message} hint="Usado para confirmação e rastreio do pedido">
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="joao@email.com"
          className={inputClass(!!errors.email)}
          {...register("email")}
        />
      </Field>

      <Field label="Telefone (WhatsApp)" htmlFor="phone" error={errors.phone?.message} hint="Para atualizações do pedido via WhatsApp">
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
          maxLength={15}
          className={inputClass(!!errors.phone)}
          value={phoneValue}
          onChange={(e) => setValue("phone", maskPhone(e.target.value), { shouldValidate: phoneValue.length >= 14 })}
        />
      </Field>

      {authMode === "guest" && (
        <div className="rounded-xl bg-[#F0F4FF] dark:bg-[#0057FF]/10 border border-[#0057FF]/10 px-4 py-3">
          <p className="text-xs font-body text-[#1A1A2E] dark:text-white/70 leading-relaxed">
            Após a compra, enviaremos um link para você criar uma senha e acompanhar seus pedidos facilmente.
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full px-6 py-4 rounded-full bg-[#0057FF] text-white font-display font-bold text-base hover:bg-[#0046D4] hover:shadow-[0_4px_20px_rgba(0,87,255,0.4)] transition-all duration-200"
      >
        Próximo — Endereço →
      </button>
    </form>
  );
}

// ─── Step 2: Address ──────────────────────────────────────────────────────────

function StepAddress({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues?: Partial<AddressData>;
  onNext: (data: AddressData) => void;
  onBack: () => void;
}) {
  const { fetchCEP, status: cepStatus } = useCEP();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const zipValue = watch("zip") ?? "";

  async function handleCEPBlur(value: string) {
    const clean = value.replace(/\D/g, "");
    if (clean.length !== 8) return;
    const found = await fetchCEP(clean);
    if (found) {
      setValue("street", found.street, { shouldValidate: true });
      setValue("complement", found.complement);
      setValue("neighborhood", found.neighborhood, { shouldValidate: true });
      setValue("city", found.city, { shouldValidate: true });
      setValue("state", found.state, { shouldValidate: true });
    }
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Field label="CEP" htmlFor="zip" error={errors.zip?.message}>
            <div className="relative">
              <input
                id="zip"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                maxLength={9}
                className={inputClass(!!errors.zip)}
                value={zipValue}
                onChange={(e) => setValue("zip", maskCEP(e.target.value))}
                onBlur={(e) => handleCEPBlur(e.target.value)}
              />
              {cepStatus === "loading" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-[#0057FF] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                </span>
              )}
              {cepStatus === "found" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-[#00C48C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>
            {cepStatus === "not_found" && (
              <p className="text-xs text-[#FF3D57] font-body mt-1">CEP não encontrado</p>
            )}
          </Field>
        </div>
      </div>

      <Field label="Logradouro" htmlFor="street" error={errors.street?.message}>
        <input id="street" type="text" autoComplete="street-address" placeholder="Rua, Avenida..." className={inputClass(!!errors.street)} {...register("street")} />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Field label="Número" htmlFor="number" error={errors.number?.message}>
            <input id="number" type="text" placeholder="123" className={inputClass(!!errors.number)} {...register("number")} />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Complemento" htmlFor="complement">
            <input id="complement" type="text" placeholder="Apto, Bloco..." className={inputClass()} {...register("complement")} />
          </Field>
        </div>
      </div>

      <Field label="Bairro" htmlFor="neighborhood" error={errors.neighborhood?.message}>
        <input id="neighborhood" type="text" placeholder="Centro" className={inputClass(!!errors.neighborhood)} {...register("neighborhood")} />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Field label="Cidade" htmlFor="city" error={errors.city?.message}>
            <input id="city" type="text" autoComplete="address-level2" placeholder="São Paulo" className={inputClass(!!errors.city)} {...register("city")} />
          </Field>
        </div>
        <div className="col-span-1">
          <Field label="UF" htmlFor="state" error={errors.state?.message}>
            <input id="state" type="text" autoComplete="address-level1" placeholder="SP" maxLength={2} className={`${inputClass(!!errors.state)} uppercase`} {...register("state")} />
          </Field>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-4 rounded-full border border-[#E2E6F0] dark:border-white/10 text-[#1A1A2E] dark:text-white font-display font-semibold text-base hover:border-[#0057FF] hover:text-[#0057FF] transition-all duration-200"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          className="flex-[2] px-6 py-4 rounded-full bg-[#0057FF] text-white font-display font-bold text-base hover:bg-[#0046D4] hover:shadow-[0_4px_20px_rgba(0,87,255,0.4)] transition-all duration-200"
        >
          Revisar pedido →
        </button>
      </div>
    </form>
  );
}

// ─── Step 3: Consent + Review ─────────────────────────────────────────────────

function StepConsent({
  personal,
  address,
  onNext,
  onBack,
  isLoading,
}: {
  personal: PersonalData;
  address: AddressData;
  onNext: (consent: ConsentData) => void;
  onBack: () => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      termsAccepted: false,
      consentMarketingEmail: false,
      consentMarketingWhatsapp: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-6">
      {/* Data review */}
      <div className="rounded-2xl border border-[#E2E6F0] dark:border-white/10 overflow-hidden">
        <div className="px-5 py-3 bg-[#F8F9FC] dark:bg-white/5 border-b border-[#E2E6F0] dark:border-white/10">
          <p className="text-sm font-display font-bold text-[#1A1A2E] dark:text-white">Dados informados</p>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <ReviewRow label="Nome" value={personal.name} />
          <ReviewRow label="CPF" value={personal.cpf} />
          <ReviewRow label="E-mail" value={personal.email} />
          <ReviewRow label="Telefone" value={personal.phone} />
          <div className="sm:col-span-2">
            <ReviewRow
              label="Endereço"
              value={`${address.street}, ${address.number}${address.complement ? ` — ${address.complement}` : ""}, ${address.neighborhood}, ${address.city}/${address.state} — ${address.zip}`}
            />
          </div>
        </div>
      </div>

      {/* LGPD consent checkboxes */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-body text-[#6B7080] dark:text-white/50 font-semibold uppercase tracking-wide">Termos e preferências</p>

        <CheckboxField
          id="termsAccepted"
          error={errors.termsAccepted?.message}
          {...register("termsAccepted")}
        >
          Li e aceito os{" "}
          <a href="/termos" className="text-[#0057FF] underline hover:no-underline" target="_blank">Termos de Uso</a>
          {" "}e a{" "}
          <a href="/privacidade" className="text-[#0057FF] underline hover:no-underline" target="_blank">Política de Privacidade</a>.
          {" "}<span className="text-[#FF3D57]">*</span>
        </CheckboxField>

        <CheckboxField
          id="consentMarketingEmail"
          {...register("consentMarketingEmail")}
        >
          Desejo receber ofertas e novidades por <strong>e-mail</strong>.{" "}
          <span className="text-[#6B7080] dark:text-white/40">(opcional)</span>
        </CheckboxField>

        <CheckboxField
          id="consentMarketingWhatsapp"
          {...register("consentMarketingWhatsapp")}
        >
          Desejo receber promoções por <strong>WhatsApp/SMS</strong>.{" "}
          <span className="text-[#6B7080] dark:text-white/40">(opcional)</span>
        </CheckboxField>
      </div>

      {/* Security seals */}
      <div className="flex items-center gap-4 justify-center">
        <SecuritySeal icon="🔒" label="SSL 256-bit" />
        <SecuritySeal icon="🛡️" label="Antifraude" />
        <SecuritySeal icon="📄" label="Nota fiscal" />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-4 rounded-full border border-[#E2E6F0] dark:border-white/10 text-[#1A1A2E] dark:text-white font-display font-semibold text-base hover:border-[#0057FF] hover:text-[#0057FF] transition-all duration-200"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-[2] px-6 py-4 rounded-full bg-[#0057FF] text-white font-display font-bold text-base hover:bg-[#0046D4] hover:shadow-[0_4px_20px_rgba(0,87,255,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5"
        >
          {isLoading ? (
            <>
              <svg className="w-4.5 h-4.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Preparando pagamento…
            </>
          ) : (
            "Ir para o pagamento →"
          )}
        </button>
      </div>
    </form>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-body font-semibold uppercase tracking-wide text-[#6B7080] dark:text-white/40">{label}</p>
      <p className="text-sm font-body text-[#1A1A2E] dark:text-white mt-0.5">{value}</p>
    </div>
  );
}

import React from "react";

const CheckboxField = React.forwardRef<
  HTMLInputElement,
  { id: string; children: React.ReactNode; error?: string } & React.InputHTMLAttributes<HTMLInputElement>
>(({ id, children, error, ...props }, ref) => (
  <div>
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="mt-0.5 w-4 h-4 rounded border-[#C4C9D9] accent-[#0057FF] flex-shrink-0 cursor-pointer"
        {...props}
      />
      <span className="text-sm font-body text-[#1A1A2E] dark:text-white/80 leading-relaxed group-hover:text-[#0057FF] transition-colors">
        {children}
      </span>
    </label>
    {error && (
      <p className="text-xs text-[#FF3D57] font-body mt-1 ml-7">{error}</p>
    )}
  </div>
));
CheckboxField.displayName = "CheckboxField";

function SecuritySeal({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-body text-[#6B7080] dark:text-white/50">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface CheckoutFormProps {
  authMode: AuthMode;
  prefill?: Partial<PersonalData>;
  onSubmit: (data: CheckoutData) => Promise<void>;
}

export default function CheckoutForm({ authMode, prefill, onSubmit }: CheckoutFormProps) {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<PersonalData | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handlePersonalNext(data: PersonalData) {
    setPersonal(data);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAddressNext(data: AddressData) {
    setAddress(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConsentNext(consent: ConsentData) {
    if (!personal || !address) return;
    setIsLoading(true);
    try {
      await onSubmit({ personal, address, consent });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <StepIndicator current={step} />

      <p className="text-xs font-body text-[#6B7080] dark:text-white/40 mb-6">
        Etapa {step + 1} de {STEPS.length} — <span className="font-semibold text-[#1A1A2E] dark:text-white">{STEPS[step]}</span>
      </p>

      {step === 0 && (
        <StepPersonal
          defaultValues={prefill}
          onNext={handlePersonalNext}
          authMode={authMode}
        />
      )}
      {step === 1 && (
        <StepAddress
          defaultValues={address ?? undefined}
          onNext={handleAddressNext}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && personal && address && (
        <StepConsent
          personal={personal}
          address={address}
          onNext={handleConsentNext}
          onBack={() => setStep(1)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
