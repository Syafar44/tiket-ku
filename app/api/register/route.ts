import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { registerToSheet, SHEETS_TAG } from "@/lib/sheets";

const bodySchema = z.object({
  slug: z.string().trim().min(1).max(200),
  name: z.string().trim().min(2).max(100),
  prodi: z.string().trim().min(2).max(80),
  registrationId: z.uuid(),
});

const MESSAGES = {
  event_ended: "Acara ini sudah selesai.",
  event_not_found: "Event tidak ditemukan.",
  invalid_input: "Data belum lengkap.",
  rate_limited: "Terlalu banyak percobaan, coba lagi sebentar.",
  fallback: "Gagal mendaftar, coba lagi.",
} as const;

const STATUS: Record<string, number> = { event_ended: 409, event_not_found: 404, invalid_input: 400 };

function fail(error: keyof typeof MESSAGES | string, status: number) {
  const message = error in MESSAGES ? MESSAGES[error as keyof typeof MESSAGES] : MESSAGES.fallback;
  return NextResponse.json({ ok: false, error: message }, { status });
}

/*
 * Rate limit sederhana: maks 10 request/menit per IP.
 * In-memory → berlaku per instance server (di Vercel tiap instance punya hitungan sendiri). Cukup untuk menahan spam ringan.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  const limited = recent.length >= MAX_REQUESTS;
  if (!limited) recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return limited;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) return fail("rate_limited", 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("invalid_input", 400);
  }
  const input = bodySchema.safeParse(body);
  if (!input.success) return fail("invalid_input", 400);

  try {
    const result = await registerToSheet(input.data);
    if (!result.ok) {
      if (result.error === "unauthorized") console.error("[EventKu] Spreadsheet menolak token (unauthorized). Cek SHEETS_API_TOKEN.");
      else if (!(result.error in STATUS)) console.error("[EventKu] Spreadsheet gagal memproses pendaftaran:", result.error);
      return fail(result.error, STATUS[result.error] ?? 502);
    }
    // Jumlah pendaftar & data event ikut segar di request berikutnya.
    revalidateTag(SHEETS_TAG);
    return NextResponse.json({ ok: true, registrationId: result.registrationId, registrantCount: result.registrantCount });
  } catch (err) {
    console.error("[EventKu] Gagal meneruskan pendaftaran ke spreadsheet:", err instanceof Error ? err.message : err);
    return fail("fallback", 502);
  }
}
