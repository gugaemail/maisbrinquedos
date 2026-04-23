import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/brand/Logo";

export default function DesignPreview() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] p-10 space-y-16">

      {/* Logo */}
      <section className="space-y-6">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#6B7080]">Logo</h2>
        <div className="flex flex-wrap items-end gap-8">
          <Logo size="sm" theme="light" />
          <Logo size="md" theme="light" />
          <Logo size="lg" theme="light" />
        </div>
        <div className="flex flex-wrap items-end gap-8 bg-[#0F0F0F] p-6 rounded-2xl">
          <Logo size="sm" theme="dark" />
          <Logo size="md" theme="dark" />
          <Logo size="lg" theme="dark" />
        </div>
      </section>

      {/* Tipografia */}
      <section className="space-y-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#6B7080]">Tipografia</h2>
        <p className="font-display font-black text-5xl text-[#0F0F0F]">Unbounded Black — Headlines</p>
        <p className="font-display font-bold text-3xl text-[#0F0F0F]">Unbounded Bold — Subtítulos</p>
        <p className="font-body font-light text-lg text-[#0F0F0F]">Plus Jakarta Sans Light — Corpo leve</p>
        <p className="font-body font-normal text-lg text-[#0F0F0F]">Plus Jakarta Sans Regular — Corpo padrão</p>
        <p className="font-body font-bold text-lg text-[#0F0F0F]">Plus Jakarta Sans Bold — Destaque no corpo</p>
      </section>

      {/* Paleta */}
      <section className="space-y-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#6B7080]">Paleta</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { name: "Brand Red",    hex: "#FF3D5A" },
            { name: "Brand Yellow", hex: "#FFE14D" },
            { name: "Brand Green",  hex: "#3DDC84" },
            { name: "Brand Blue",   hex: "#3B8BFF" },
            { name: "Brand Black",  hex: "#0F0F0F" },
            { name: "Off-White",    hex: "#FAFAF7", border: true },
          ].map(({ name, hex, border }) => (
            <div key={hex} className="flex flex-col items-center gap-2">
              <div
                className={`w-20 h-20 rounded-2xl ${border ? "border border-[#e0e0dc]" : ""}`}
                style={{ background: hex }}
              />
              <span className="font-body text-xs text-[#6B7080]">{name}</span>
              <span className="font-body text-xs font-bold text-[#0F0F0F]">{hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Botões */}
      <section className="space-y-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#6B7080]">Botões</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Comprar agora</Button>
          <Button variant="accent">Ver promoções</Button>
          <Button variant="dark">Explorar catálogo</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#6B7080]">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="new" />
          <Badge variant="promo" />
          <Badge variant="available" />
          <Badge variant="age">3–6 anos</Badge>
          <Badge variant="gift" />
        </div>
      </section>

      {/* Composição de exemplo */}
      <section className="space-y-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#6B7080]">Composição</h2>
        <div className="bg-white rounded-2xl p-6 max-w-sm shadow-sm border border-[#e8e8e4] space-y-4">
          <div className="flex gap-2">
            <Badge variant="new" />
            <Badge variant="promo" />
          </div>
          <p className="font-display font-bold text-2xl text-[#0F0F0F]">Lego Technic Mars Rover</p>
          <p className="font-body text-[#6B7080] text-sm">Set com 1.232 peças. Para maiores de 10 anos. Constrói um rover espacial funcional.</p>
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-2xl text-[#FF3D5A]">R$ 349,90</span>
            <Badge variant="age">10+ anos</Badge>
          </div>
          <Button variant="primary" className="w-full">Adicionar ao carrinho</Button>
        </div>
      </section>

    </main>
  );
}
