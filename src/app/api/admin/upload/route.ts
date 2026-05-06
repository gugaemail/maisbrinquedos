import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase";

const BUCKET = "product-images";
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4"];

// Magic bytes for each allowed MIME type
const MAGIC_BYTES: Record<string, { offset: number; bytes: number[] }[]> = {
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/png":  [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }],
  "image/webp": [{ offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }],
  "image/gif":  [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }],
  "video/mp4":  [
    { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }, // ftyp box
  ],
};

async function verifyMagicBytes(file: File): Promise<boolean> {
  const checks = MAGIC_BYTES[file.type];
  if (!checks) return false;
  const maxOffset = Math.max(...checks.map((c) => c.offset + c.bytes.length));
  const header = new Uint8Array(await file.slice(0, maxOffset).arrayBuffer());
  return checks.some((check) =>
    check.bytes.every((b, i) => header[check.offset + i] === b)
  );
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role as string) ?? "operator";
  if (role !== "admin") return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
  }
  if (!(await verifyMagicBytes(file))) {
    return NextResponse.json({ error: "File content does not match declared type" }, { status: 400 });
  }

  // Use the canonical extension from MIME type, not from the filename
  const EXT_MAP: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
  };
  const ext = EXT_MAP[file.type] ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const serviceClient = createSupabaseServiceClient();
  const { error } = await serviceClient.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: { publicUrl } } = serviceClient.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
