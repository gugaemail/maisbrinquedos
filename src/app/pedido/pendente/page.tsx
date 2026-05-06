import HeaderServer from "@/components/HeaderServer";
import PedidoResult from "@/components/PedidoResult";

export default function PedidoPendente() {
  return (
    <>
      <HeaderServer />
      <PedidoResult
        emoji="⏳"
        title="Pagamento pendente"
        description="Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail assim que aprovado."
        actions={[{ href: "/", label: "Voltar para a loja", primary: true }]}
      />
    </>
  );
}
