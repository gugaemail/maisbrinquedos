"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  textPosition: string;
  overlay: string;
  tag: string | null;
  active: boolean;
  order: number;
}

const blankForm = {
  title: "", subtitle: "", ctaText: "", ctaLink: "",
  imageUrl: "", videoUrl: "", textPosition: "left", overlay: "dark", tag: "",
};

export default function BannersList({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<Banner | null>(null);
  const [editForm, setEditForm] = useState(blankForm);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editUploading, setEditUploading] = useState(false);

  function openEdit(b: Banner) {
    setEditing(b);
    setEditForm({
      title: b.title, subtitle: b.subtitle ?? "",
      ctaText: b.ctaText ?? "", ctaLink: b.ctaLink ?? "",
      imageUrl: b.imageUrl ?? "", videoUrl: b.videoUrl ?? "",
      textPosition: b.textPosition, overlay: b.overlay, tag: b.tag ?? "",
    });
    setEditPreview(b.imageUrl ?? null);
  }

  function closeEdit() {
    setEditing(null);
    setEditPreview(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  }

  async function handleEditImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPreview(URL.createObjectURL(file));
    setEditUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setEditForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Mídia enviada!");
    } catch {
      toast.error("Erro ao enviar mídia");
      setEditPreview(editing?.imageUrl ?? null);
      setEditForm((f) => ({ ...f, imageUrl: editing?.imageUrl ?? "" }));
    } finally {
      setEditUploading(false);
    }
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/banners/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (!res.ok) { toast.error("Erro ao salvar"); return; }
    const updated: Banner = await res.json();
    setBanners((prev) => prev.map((b) => b.id === updated.id ? updated : b));
    toast.success("Banner atualizado!");
    closeEdit();
  }

  const inp = "w-full px-4 py-2.5 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#0F0F0F] outline-none focus:border-[#3B8BFF] transition-colors";

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Mídia enviada!");
    } catch {
      toast.error("Erro ao enviar mídia");
      setPreview(null);
      setForm((f) => ({ ...f, imageUrl: "" }));
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage() {
    setPreview(null);
    setForm((f) => ({ ...f, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: banners.length }),
    });
    if (!res.ok) { toast.error("Erro ao criar banner"); return; }
    const created: Banner = await res.json();
    setBanners((prev) => [...prev, created]);
    setForm(blankForm);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCreating(false);
    toast.success("Banner criado!");
  }

  async function handleToggle(id: string, active: boolean) {
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (!res.ok) { toast.error("Erro ao atualizar"); return; }
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, active: !active } : b));
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir banner?")) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao excluir"); return; }
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success("Banner excluído");
  }

  return (
    <div className="max-w-3xl">
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={handleEditSave} className="bg-white rounded-2xl border border-[#E2E6F0] p-6 flex flex-col gap-4 w-full max-w-lg shadow-xl">
            <h2 className="text-sm font-display font-bold text-[#0F0F0F]">Editar banner</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Título *</label>
                <input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} required className={inp} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Subtítulo</label>
                <input value={editForm.subtitle} onChange={(e) => setEditForm((f) => ({ ...f, subtitle: e.target.value }))} className={inp} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Texto do botão</label>
                <input value={editForm.ctaText} onChange={(e) => setEditForm((f) => ({ ...f, ctaText: e.target.value }))} className={inp} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Link do botão</label>
                <input value={editForm.ctaLink} onChange={(e) => setEditForm((f) => ({ ...f, ctaLink: e.target.value }))} className={inp} placeholder="/produtos" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Tag / Badge</label>
                <input value={editForm.tag} onChange={(e) => setEditForm((f) => ({ ...f, tag: e.target.value }))} className={inp} placeholder="Coleção 2026" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Posição do texto</label>
                <select value={editForm.textPosition} onChange={(e) => setEditForm((f) => ({ ...f, textPosition: e.target.value }))} className={inp}>
                  <option value="left">Esquerda (split)</option>
                  <option value="center">Centralizado</option>
                  <option value="bottom-bar">Barra inferior</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Overlay</label>
                <select value={editForm.overlay} onChange={(e) => setEditForm((f) => ({ ...f, overlay: e.target.value }))} className={inp}>
                  <option value="dark">Escuro (texto na cor da paleta)</option>
                  <option value="light">Claro (texto branco)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">URL do vídeo (opcional)</label>
                <input value={editForm.videoUrl} onChange={(e) => setEditForm((f) => ({ ...f, videoUrl: e.target.value }))} className={inp} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Imagem / GIF</label>
                {editPreview ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#E2E6F0] bg-[#F7F8FC]">
                    {editForm.imageUrl.endsWith(".mp4") ? (
                      <video src={editPreview} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editPreview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    {editUploading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-semibold text-[#3B8BFF] animate-pulse">Enviando...</span>
                      </div>
                    )}
                    {!editUploading && (
                      <button type="button" onClick={() => { setEditPreview(null); setEditForm((f) => ({ ...f, imageUrl: "" })); if (editFileInputRef.current) editFileInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 text-xs font-semibold text-[#FF3D5A] border border-[#E2E6F0]">
                        Remover
                      </button>
                    )}
                  </div>
                ) : (
                  <button type="button" onClick={() => editFileInputRef.current?.click()}
                    className="w-full h-28 rounded-xl border-2 border-dashed border-[#C7CEDE] flex flex-col items-center justify-center gap-1 hover:border-[#3B8BFF] hover:bg-[#F0F5FF] transition-colors cursor-pointer">
                    <span className="text-xs font-semibold text-[#6B7080]">Clique para trocar a imagem</span>
                    <span className="text-[10px] text-[#9CA3AF]">JPG, PNG, WebP, GIF</span>
                  </button>
                )}
                <input ref={editFileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleEditImageUpload} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={editUploading} className="px-6 py-2.5 rounded-full bg-[#3B8BFF] text-white text-sm font-semibold disabled:opacity-50">
                {editUploading ? "Aguardando upload..." : "Salvar"}
              </button>
              <button type="button" onClick={closeEdit} className="px-6 py-2.5 rounded-full border border-[#E2E6F0] text-[#6B7080] text-sm">Cancelar</button>
            </div>
          </form>
        </div>
      )}
      <div className="flex flex-col gap-4 mb-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-[#E2E6F0] p-6 flex items-center gap-6">
            {b.imageUrl && (
              b.imageUrl.endsWith(".mp4") ? (
                <video src={b.imageUrl} muted className="w-24 h-16 object-cover rounded-xl shrink-0" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.imageUrl} alt="" className="w-24 h-16 object-cover rounded-xl shrink-0" />
              )
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-[#0F0F0F]">{b.title}</p>
                {b.tag && <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7080] border border-[#E2E6F0] rounded-full px-2 py-0.5">{b.tag}</span>}
              </div>
              {b.subtitle && <p className="text-sm text-[#6B7080] truncate">{b.subtitle}</p>}
              <div className="flex items-center gap-2 mt-0.5">
                {b.ctaLink && <p className="text-xs text-[#6B7080] truncate font-mono">{b.ctaLink}</p>}
                <span className="text-[10px] text-[#9CA3AF] font-mono">{b.textPosition} · {b.overlay}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => handleToggle(b.id, b.active)}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${b.active ? "bg-[#3DDC84]/10 text-[#3DDC84]" : "bg-[#6B7080]/10 text-[#6B7080]"}`}>
                {b.active ? "Ativo" : "Inativo"}
              </button>
              <button onClick={() => openEdit(b)} className="text-[#3B8BFF] text-xs font-semibold hover:underline">
                Editar
              </button>
              <button onClick={() => handleDelete(b.id)} className="text-[#FF3D5A] text-xs font-semibold hover:underline">
                Excluir
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-sm text-[#6B7080] font-body">Nenhum banner cadastrado.</p>
        )}
      </div>

      {creating ? (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#E2E6F0] p-6 flex flex-col gap-4">
          <h2 className="text-sm font-display font-bold text-[#0F0F0F]">Novo banner</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Título *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Subtítulo</label>
              <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Texto do botão</label>
              <input value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Link do botão</label>
              <input value={form.ctaLink} onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))} className={inp} placeholder="/produtos" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Tag / Badge</label>
              <input value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} className={inp} placeholder="Coleção 2026" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Posição do texto</label>
              <select value={form.textPosition} onChange={(e) => setForm((f) => ({ ...f, textPosition: e.target.value }))} className={inp}>
                <option value="left">Esquerda (split)</option>
                <option value="center">Centralizado</option>
                <option value="bottom-bar">Barra inferior</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Overlay</label>
              <select value={form.overlay} onChange={(e) => setForm((f) => ({ ...f, overlay: e.target.value }))} className={inp}>
                <option value="dark">Escuro (texto na cor da paleta)</option>
                <option value="light">Claro (texto branco)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">URL do vídeo (opcional)</label>
              <input value={form.videoUrl} onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))} className={inp} placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-[#0F0F0F] block mb-1">Imagem / GIF do banner</label>
              {preview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#E2E6F0] bg-[#F7F8FC]">
                  {preview.includes("blob:") && fileInputRef.current?.files?.[0]?.type === "video/mp4" || form.imageUrl.endsWith(".mp4") ? (
                    <video src={preview} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#3B8BFF] animate-pulse">Enviando...</span>
                    </div>
                  )}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 text-xs font-semibold text-[#FF3D5A] border border-[#E2E6F0] hover:bg-[#FFF0F2] transition-colors"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-[#C7CEDE] flex flex-col items-center justify-center gap-1 hover:border-[#3B8BFF] hover:bg-[#F0F5FF] transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6 text-[#6B7080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-xs font-semibold text-[#6B7080]">Clique para enviar imagem, GIF ou vídeo</span>
                  <span className="text-[10px] text-[#9CA3AF]">JPG, PNG, WebP, GIF, MP4 — máx. 50MB</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-full bg-[#3B8BFF] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? "Aguardando upload..." : "Criar"}
            </button>
            <button type="button" onClick={() => { setCreating(false); setPreview(null); setForm(blankForm); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="px-6 py-2.5 rounded-full border border-[#E2E6F0] text-[#6B7080] text-sm">Cancelar</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setCreating(true)} className="px-6 py-3 rounded-full bg-[#3B8BFF] text-white text-sm font-semibold hover:bg-[#0046CC] transition-colors">
          + Novo banner
        </button>
      )}
    </div>
  );
}
