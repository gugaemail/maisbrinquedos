import Header from "@/components/Header";
import PedidoResult from "@/components/PedidoResult";

export default function PedidoPendente() {
  return (
    <>
      <Header />
      <PedidoResult
        emoji="⏳"
        title="Pagamento pendente"
        description="Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail assim que aprovado."
        actions={[{ href: "/", label: "Voltar para a loja", primary: true }]}
      />
    </>
  );
}
