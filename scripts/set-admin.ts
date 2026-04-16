/**
 * Promove um usuário para admin via Supabase Admin API.
 * Uso: npx tsx scripts/set-admin.ts <user-id>
 */
import { createClient } from "@supabase/supabase-js";

const userId = process.argv[2];
if (!userId) {
  console.error("Uso: npx tsx scripts/set-admin.ts <user-id>");
  process.exit(1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

sb.auth.admin.updateUserById(userId, {
  app_metadata: { role: "admin" },
}).then(({ data, error }) => {
  if (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  }
  console.log("Usuário promovido para admin:", data.user.email);
  console.log("app_metadata:", data.user.app_metadata);
});
