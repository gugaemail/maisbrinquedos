import { db } from "@/lib/db";
import ConfiguracoesForm from "./ConfiguracoesForm";

export default async function ConfiguracoesPage() {
  const settings = await db.setting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-display font-extrabold text-[#1A1A2E] mb-8">Configurações</h1>
      <ConfiguracoesForm
        pixDiscountPercent={map.pix_discount_percent ?? "5"}
        maxInstallments={map.max_installments ?? "12"}
        freeShippingThreshold={map.free_shipping_threshold ?? "150"}
        paymentMethodsDisabled={JSON.parse(map.payment_methods_disabled ?? "[]")}
      />
    </div>
  );
}
