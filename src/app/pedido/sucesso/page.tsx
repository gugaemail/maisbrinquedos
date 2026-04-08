import Header from "@/components/Header";
import PedidoResult from "@/components/PedidoResult";

export default function PedidoSucesso() {
  return (
    <>
      <Header />
      <PedidoResult
        emoji="🎉"
        title="Pedido confirmado!"
        description="Seu pagamento foi aprovado. Em breve você receberá um e-mail com os detalhes do pedido."
        actions={[{ href: "/", label: "Continuar comprando", primary: true }]}
      />
    </>
  );
}
