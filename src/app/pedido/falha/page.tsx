import Header from "@/components/Header";
import PedidoResult from "@/components/PedidoResult";

export default function PedidoFalha() {
  return (
    <>
      <Header />
      <PedidoResult
        emoji="😞"
        title="Pagamento não aprovado"
        description="Houve um problema com seu pagamento. Verifique os dados e tente novamente."
        actions={[
          { href: "/carrinho", label: "Tentar novamente", primary: true },
          { href: "/", label: "Voltar para a loja" },
        ]}
      />
    </>
  );
}
