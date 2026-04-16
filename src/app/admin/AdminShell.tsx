"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Toaster } from "sonner";

// — Nav icons (inline SVGs, weight regular, 18×18) —

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconProducts() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconBanners() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconCategories() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const allNavItems = [
  { href: "/admin/dashboard",    label: "Dashboard",    Icon: IconDashboard,  roles: ["admin", "operator"] },
  { href: "/admin/produtos",     label: "Produtos",     Icon: IconProducts,   roles: ["admin", "operator"] },
  { href: "/admin/pedidos",      label: "Pedidos",      Icon: IconOrders,     roles: ["admin", "operator"] },
  { href: "/admin/banners",      label: "Banners",      Icon: IconBanners,    roles: ["admin", "operator"] },
  { href: "/admin/categorias",   label: "Categorias",   Icon: IconCategories, roles: ["admin", "operator"] },
  { href: "/admin/usuarios",     label: "Usuários",     Icon: IconUsers,      roles: ["admin"] },
  { href: "/admin/configuracoes",label: "Configurações",Icon: IconSettings,   roles: ["admin"] },
];

interface Props {
  children: React.ReactNode;
  role: string;
  userName: string;
}

export default function AdminShell({ children, role, userName }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return (
      <>
        <Toaster richColors position="top-right" />
        {children}
      </>
    );
  }

  const navItems = allNavItems.filter((item) => item.roles.includes(role));
  const displayName = userName.includes("@") ? userName.split("@")[0] : userName;
  const roleLabel = role === "admin" ? "Administrador" : "Operador";

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-[#0D0D1A]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#0D0D1A] border-r border-white/8 flex flex-col min-h-screen">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/8">
          <p className="font-display font-bold text-white text-sm leading-tight tracking-tight">Mais Brinquedos</p>
          <span className="text-[10px] text-white/35 font-body uppercase tracking-widest mt-0.5 block">Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-150 ${
                  active
                    ? "bg-white/8 text-white font-semibold"
                    : "text-white/45 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#0057FF]" />
                )}
                <item.Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/8 flex flex-col gap-0.5">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-semibold text-white/80 truncate font-body">{displayName}</p>
            <p className="text-[11px] text-white/35 font-body">{roleLabel}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-150"
          >
            <IconLogout />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-[#0D0D1A]">
        <Toaster richColors position="top-right" />
        {children}
      </main>
    </div>
  );
}
