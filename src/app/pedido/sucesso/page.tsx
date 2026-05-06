import HeaderServer from "@/components/HeaderServer";
import PedidoResult from "@/components/PedidoResult";

export default function PedidoSucesso() {
  return (
    <>
      <HeaderServer />
      <PedidoResult
        emoji="🎉"
        title="Pedido confirmado!"
        description="Seu pagamento foi aprovado. Em breve você receberá um e-mail com os detalhes do pedido."
        actions={[{ href: "/", label: "Continuar comprando", primary: true }]}
      />
    </>
  );
}
