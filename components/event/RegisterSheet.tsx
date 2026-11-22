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

const inputCls =
  "h-[40px] w-full rounded-[8px] border bg-white px-[14px] text-[15px] text-text outline-none transition-colors duration-150 placeholder:text-text-disabled focus:border-link";

/** Form Daftar Event (bottom sheet). */
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
  const nameRef = useRef<HTMLInputElement>(null);
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
  const [touched, setTouched] = useState({ name: false, other: false });
  const [submitting, setSubmitting] = useState(false);

  const isOther = prodi === PRODI_OTHER;
  const finalProdi = isOther ? otherProdi.trim() : prodi;
  const nameError = name.trim().length < 3 ? "Isi nama lengkap (minimal 3 huruf)." : null;
  const otherError = isOther && otherProdi.trim().length < 3 ? "Tulis nama program studimu." : null;
  const valid = !nameError && !!prodi && !otherError;

  const submit = async () => {
    if (!valid || inFlightRef.current) return;
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

  const id = (f: string) => `${uid}-${f}`;

  return (
    <form
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
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            autoComplete="name"
            maxLength={100}
            placeholder="Nama sesuai KTM"
            aria-invalid={touched.name && !!nameError}
            aria-describedby={touched.name && nameError ? id("name-error") : undefined}
            className={cx(inputCls, touched.name && nameError ? "border-danger" : "border-border-strong")}
          />
          {touched.name && nameError && (
            <p id={id("name-error")} className="mt-[4px] text-[12.5px] text-danger">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("prodi")} className="mb-[4px] block text-[13px] text-text-muted">
            Program studi <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              id={id("prodi")}
              value={prodi}
              onChange={(e) => setProdi(e.target.value)}
              className={cx(inputCls, "appearance-none border-border-strong pr-[38px]", !prodi && "text-text-disabled")}
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
          {isOther && (
            <>
              <input
                id={id("other")}
                value={otherProdi}
                onChange={(e) => setOtherProdi(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, other: true }))}
                maxLength={80}
                placeholder="Tulis program studimu"
                aria-label="Program studi lainnya"
                aria-invalid={touched.other && !!otherError}
                className={cx(inputCls, "mt-[8px]", touched.other && otherError ? "border-danger" : "border-border-strong")}
              />
              {touched.other && otherError && <p className="mt-[4px] text-[12.5px] text-danger">{otherError}</p>}
            </>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-[10px] py-[4px] text-[14px] text-text">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-[18px] shrink-0 accent-[#138CDF]"
          />
          Ingat data saya di perangkat ini
        </label>
      </div>

      <p className="mt-[12px] text-[13px] leading-[18px] text-text-muted">Gratis. Cukup datang dan isi presensi di akhir sesi.</p>

      <div className="-mx-[20px] mt-[16px]">
        <CtaButton type="submit" withIcon={false} disabled={!valid || submitting}>
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
