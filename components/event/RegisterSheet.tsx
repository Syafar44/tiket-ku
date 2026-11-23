"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { PRODI_OTHER } from "@/lib/config";
import { cx } from "@/lib/format";
import { newRegistrationId, RegistrationError, submitRegistration } from "@/lib/registration";
import { formatSchedule } from "@/lib/time";
import type { EventItem } from "@/lib/types";
import { useProfile } from "@/store/useProfile";
import { useToast } from "@/store/useToast";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { CtaButton } from "@/components/ui/Button";

interface RegisterSheetProps {
  event: EventItem;
  /** Dari `getSiteConfig()` (server). Selalu diakhiri "Lainnya". */
  prodiOptions: string[];
  open: boolean;
  onClose: () => void;
}

/** 16px: di bawah itu iOS Safari otomatis zoom saat input difokus. */
const inputCls =
  "h-[44px] w-full rounded-[8px] border bg-white px-[14px] text-[16px] text-text outline-none transition-colors duration-150 placeholder:text-text-disabled focus:border-link";

const errorCls = "mt-[4px] text-[12.5px] text-danger";

type Field = "name" | "prodi" | "other";

/** Form Daftar Event (bottom sheet). Sheet & form sengaja didefinisikan di level modul supaya tidak di-remount. */
export function RegisterSheet({ event, prodiOptions, open, onClose }: RegisterSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} labelledBy="register-title">
      {/* BottomSheet melepas isinya setelah animasi keluar, jadi form dipasang ulang tiap dibuka
          (isian awal selalu dari profil terbaru) dan tetap terlihat selama sheet turun. */}
      <RegisterForm event={event} prodiOptions={prodiOptions} onClose={onClose} />
    </BottomSheet>
  );
}

function RegisterForm({ event, prodiOptions, onClose }: { event: EventItem; prodiOptions: string[]; onClose: () => void }) {
  const router = useRouter();
  const toast = useToast((s) => s.show);
  const profile = useProfile();
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const nameRef = useRef<HTMLInputElement>(null);
  const prodiRef = useRef<HTMLSelectElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);
  // Satu ID per form yang dibuka: klik ganda / coba lagi memakai ID yang sama (tidak dobel di spreadsheet).
  const registrationIdRef = useRef<string | null>(null);
  // Penjaga sinkron: state `submitting` belum ter-update di antara dua klik yang sangat cepat.
  const inFlightRef = useRef(false);

  const remembered = profile.remember && profile.name.trim().length > 0;
  const knownProdi = prodiOptions.includes(profile.prodi) && profile.prodi !== PRODI_OTHER;
  const [name, setName] = useState(remembered ? profile.name : "");
  const [prodi, setProdi] = useState(remembered ? (knownProdi ? profile.prodi : profile.prodi ? PRODI_OTHER : "") : "");
  const [otherProdi, setOtherProdi] = useState(remembered && !knownProdi ? profile.prodi : "");
  // Default tercentang.
  const [remember, setRemember] = useState(true);
  // Pesan error baru tampil setelah field ditinggalkan (blur) atau setelah tombol konfirmasi ditekan.
  const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, prodi: false, other: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOther = prodi === PRODI_OTHER;
  const finalProdi = isOther ? otherProdi.trim() : prodi;
  const errors: Record<Field, string | null> = {
    name: name.trim().length < 3 ? "Isi nama lengkap (minimal 3 huruf)." : null,
    prodi: !prodi ? "Pilih program studimu." : null,
    other: isOther && otherProdi.trim().length < 3 ? "Tulis nama program studimu." : null,
  };
  const valid = !errors.name && !errors.prodi && !errors.other;
  const shown = (f: Field) => (touched[f] || submitAttempted ? errors[f] : null);
  const touch = (f: Field) => setTouched((t) => (t[f] ? t : { ...t, [f]: true }));

  const fieldProps = (f: Field) => ({
    "aria-invalid": !!shown(f),
    "aria-describedby": shown(f) ? id(`${f}-error`) : undefined,
    onBlur: () => touch(f),
  });

  const submit = async () => {
    if (inFlightRef.current) return;
    if (!valid) {
      setSubmitAttempted(true);
      // Arahkan ke field pertama yang belum benar.
      (errors.name ? nameRef : errors.prodi ? prodiRef : otherRef).current?.focus();
      return;
    }
    inFlightRef.current = true;
    setSubmitting(true);
    registrationIdRef.current ??= newRegistrationId();
    try {
      await submitRegistration({ event, name, prodi: finalProdi, registrationId: registrationIdRef.current });
      if (remember) profile.setProfile({ name: name.trim(), prodi: finalProdi });
      else profile.clearProfile();
      onClose();
      router.push(`/event/${event.slug}/berhasil`);
    } catch (err) {
      // Isian form tetap ada; tidak ada yang disimpan di perangkat.
      toast(err instanceof RegistrationError ? err.message : "Gagal mendaftar, coba lagi.");
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="flex flex-col"
    >
      <h2 id="register-title" className="pr-[40px] text-[19px] font-bold text-text">
        Daftar Event
      </h2>
      <p className="mt-[4px] pr-[20px] text-[15px] font-bold leading-[20px] text-text">{event.title}</p>
      {event.subtitle && <p className="line-clamp-2 pr-[20px] text-[13.5px] leading-[18px] text-text">{event.subtitle}</p>}
      <p className="mt-[2px] text-[13px] text-text-muted">{formatSchedule(event)}</p>

      {remembered && (
        <p className="mt-[12px] rounded-[8px] bg-notice-bg px-[12px] py-[8px] text-[13px] text-text-muted">
          Data diisi dari perangkat ini ·{" "}
          <button
            type="button"
            className="font-bold text-link"
            onClick={() => {
              nameRef.current?.focus();
              nameRef.current?.select();
            }}
          >
            Ubah
          </button>
        </p>
      )}

      <div className="mt-[16px] space-y-[14px]">
        <div>
          <label htmlFor={id("name")} className="mb-[4px] block text-[13px] text-text-muted">
            Nama lengkap <span className="text-danger">*</span>
          </label>
          <input
            ref={nameRef}
            id={id("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            enterKeyHint="next"
            maxLength={100}
            placeholder="Nama sesuai KTM"
            {...fieldProps("name")}
            className={cx(inputCls, shown("name") ? "border-danger" : "border-border-strong")}
          />
          {shown("name") && (
            <p id={id("name-error")} className={errorCls}>
              {shown("name")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("prodi")} className="mb-[4px] block text-[13px] text-text-muted">
            Program studi <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              ref={prodiRef}
              id={id("prodi")}
              value={prodi}
              onChange={(e) => {
                setProdi(e.target.value);
                touch("prodi");
              }}
              {...fieldProps("prodi")}
              className={cx(
                inputCls,
                "appearance-none pr-[38px]",
                shown("prodi") ? "border-danger" : "border-border-strong",
                !prodi && "text-text-disabled",
              )}
            >
              <option value="" disabled>
                Pilih program studi
              </option>
              {prodiOptions.map((p) => (
                <option key={p} value={p} className="text-text">
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
          </div>
          {shown("prodi") && (
            <p id={id("prodi-error")} className={errorCls}>
              {shown("prodi")}
            </p>
          )}
          {isOther && (
            <>
              <input
                ref={otherRef}
                id={id("other")}
                value={otherProdi}
                onChange={(e) => setOtherProdi(e.target.value)}
                maxLength={80}
                placeholder="Tulis program studimu"
                aria-label="Program studi lainnya"
                {...fieldProps("other")}
                className={cx(inputCls, "mt-[8px]", shown("other") ? "border-danger" : "border-border-strong")}
              />
              {shown("other") && (
                <p id={id("other-error")} className={errorCls}>
                  {shown("other")}
                </p>
              )}
            </>
          )}
        </div>

        <label className="flex min-h-[44px] cursor-pointer items-center gap-[10px] text-[14px] text-text">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-[18px] shrink-0 accent-[#138CDF]"
          />
          Ingat data saya di perangkat ini
        </label>
      </div>

      <p className="mt-[8px] text-[13px] leading-[18px] text-text-muted">Gratis. Cukup datang dan isi presensi di akhir sesi.</p>

      <div className="-mx-[20px] mt-[16px]">
        <CtaButton type="submit" withIcon={false} disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <Loader2 size={20} className="animate-spin" aria-hidden />
              MENDAFTARKAN…
            </>
          ) : (
            "KONFIRMASI PENDAFTARAN"
          )}
        </CtaButton>
      </div>
    </form>
  );
}
