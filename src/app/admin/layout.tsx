import { headers } from "next/headers";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const role = h.get("x-user-role") ?? "operator";
  const userName = h.get("x-user-name") ?? "";

  return <AdminShell role={role} userName={userName}>{children}</AdminShell>;
}
