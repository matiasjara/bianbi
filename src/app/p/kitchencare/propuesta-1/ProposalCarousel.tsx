"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEMO_BASE,
  DOWNLOAD_PATH,
} from "@/kitchencare/lib/constants";

const TOTAL = 5;

export function ProposalCarousel() {
  const [index, setIndex] = useState(0);
  const last = index === TOTAL - 1;

  function go(n: number) {
    setIndex((n + TOTAL) % TOTAL);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  return (
    <div className="kc-proposal mx-auto max-w-[760px] px-4 py-6 sm:px-5 sm:py-8">
      <div className="mb-3 flex items-center justify-between text-[11px] font-bold tracking-[0.14em] text-[#777d75]">
        <span>KITCHENCARE</span>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-[18px] bg-[#111311]">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
            onPointerUp={(e) => {
              const el = e.currentTarget;
              const startX = Number(el.dataset.startX ?? 0);
              const startY = Number(el.dataset.startY ?? 0);
              const dx = e.clientX - startX;
              const dy = e.clientY - startY;
              if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                go(index + (dx < 0 ? 1 : -1));
              }
            }}
            onPointerDown={(e) => {
              e.currentTarget.dataset.startX = String(e.clientX);
              e.currentTarget.dataset.startY = String(e.clientY);
            }}
          >
            <Slide dark photo>
              <Pill>Nueva marca</Pill>
              <div className="kc-slide-body">
                <p className="text-[clamp(36px,7vw,76px)] font-extrabold leading-none tracking-[-0.07em] text-[#e9e8e1]">
                  Kitchen<span className="text-[#a5b1a7]">Care</span>
                  <sup className="text-[0.35em]">®</sup>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a0afa3]">
                  Cuidado experto para tu cocina
                </p>
                <h2 className="kc-slide-title">
                  Tu cocina,
                  <br />
                  siempre funcionando.
                </h2>
                <p className="kc-slide-copy text-[#adb4aa]">
                  Una nueva marca de servicio técnico multimarca, moderna y
                  tecnológica, construida para crecer como un ecosistema de
                  cuidado.
                </p>
              </div>
              <SlideFooter meta="Una nueva etapa para el negocio." />
            </Slide>

            <Slide>
              <Pill light>Lo que vamos a crear</Pill>
              <div className="kc-slide-body">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#708774]">
                  KitchenCare
                </p>
                <h2 className="kc-slide-title text-[#171b18]">
                  Una marca.
                  <br />
                  Un ecosistema digital.
                </h2>
                <p className="kc-slide-copy text-[#777d75]">
                  Identidad, sitio, presencia digital y una primera campaña
                  experimental. El lanzamiento, no la operación mensual.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Item icon="✎" title="Nueva identidad" copy="Marca, tono y dirección visual." />
                  <Item icon="▣" title="Sitio web" copy="Diseño, desarrollo y publicación." />
                  <Item icon="◌" title="Redes sociales" copy="Configuración inicial de canales." />
                  <Item icon="↗" title="Primera campaña" copy="Lanzamiento experimental con IA." />
                </div>
              </div>
              <SlideFooter meta="Diseño + Tecnología + Estrategia" light />
            </Slide>

            <Slide dark photo>
              <Pill>La diferencia</Pill>
              <div className="kc-slide-body">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a0afa3]">
                  Laboratorio de crecimiento digital e IA
                </p>
                <h2 className="kc-slide-title">
                  Experimentamos.
                  <br />
                  Medimos. Aprendemos.
                </h2>
                <p className="kc-slide-copy text-[#adb4aa]">
                  Probamos mensajes, canales y contenidos para descubrir qué
                  genera demanda. Sin resultados comerciales garantizados.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Item dark icon="◎" title="Captación" copy="Canales y anuncios." />
                  <Item dark icon="✧" title="Contenido con IA" copy="Posts, videos y variaciones." />
                  <Item dark icon="</>" title="Activos digitales" copy="Landings y formularios." />
                  <Item dark icon="↗" title="Medición" copy="Contactos y aprendizaje." />
                </div>
              </div>
              <SlideFooter meta="Probar → Medir → Aprender" />
            </Slide>

            <Slide>
              <Pill light>Inversión y condiciones</Pill>
              <div className="kc-slide-body">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#708774]">
                  Proyecto inicial
                </p>
                <p className="text-[clamp(62px,10vw,100px)] font-extrabold leading-none tracking-[-0.08em] text-[#171b18]">
                  45 <span className="text-[#8a9a8c]">UF</span>
                </p>
                <p className="kc-slide-copy text-[#777d75]">
                  Creación de marca + ecosistema digital + lanzamiento inicial.
                  Duración estimada: 4 a 6 semanas.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 font-bold text-[#171b18]">
                    <span className="text-lg text-[#829b87]">✓</span>
                    50% al inicio · 22,5 UF
                  </div>
                  <div className="flex items-center gap-2 font-bold text-[#171b18]">
                    <span className="text-lg text-[#829b87]">✓</span>
                    50% a las 4 semanas · 22,5 UF
                  </div>
                </div>
                <div className="h-px bg-[#d9d8d0]" />
                <p className="kc-slide-copy text-[#777d75]">
                  Anuncios, dominio, hosting y herramientas externas se acuerdan y
                  pagan por separado.
                </p>
              </div>
              <SlideFooter meta="Pagos en UF según valor del día de cobro" light />
            </Slide>

            <Slide dark photo>
              <Pill>Muy importante</Pill>
              <div className="kc-slide-body">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a0afa3]">
                  Alcance del proyecto
                </p>
                <h2 className="kc-slide-title">
                  Experimentación,
                  <br />
                  no gestión mensual.
                </h2>
                <p className="kc-slide-copy text-[#adb4aa]">
                  Esta etapa lanza la marca y aprende. No es community management
                  continuo ni una plataforma de agenda, pagos o CRM.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a0afa3]">
                      Sí incluye
                    </p>
                    <p className="mt-2 text-[13px] text-[#e9e8e1]">✓ Crear y lanzar la marca</p>
                    <p className="mt-1.5 text-[13px] text-[#e9e8e1]">✓ Web y lanzamiento digital</p>
                    <p className="mt-1.5 text-[13px] text-[#e9e8e1]">✓ Primera campaña experimental con IA</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a0afa3]">
                      No incluye
                    </p>
                    <p className="mt-2 text-[13px] text-[#adb4aa]">× Presupuesto de anuncios</p>
                    <p className="mt-1.5 text-[13px] text-[#adb4aa]">× Gestión mensual de redes</p>
                    <p className="mt-1.5 text-[13px] text-[#adb4aa]">× Community management continuo</p>
                  </div>
                </div>
              </div>
              <SlideFooter meta="“Tu cocina, siempre funcionando.”" />
            </Slide>
          </div>
        </div>

        <SideArrow
          direction="prev"
          label="Lámina anterior"
          onClick={() => go(index - 1)}
        />
        <SideArrow
          direction="next"
          label="Siguiente lámina"
          emphasize
          onClick={() => go(index + 1)}
        />
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a la lámina ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full border-0 transition-all ${
              i === index ? "w-8 bg-[#de6347]" : "w-2.5 bg-[#c5cbc3] hover:bg-[#9aa198]"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full border-2 border-[#111311] bg-white px-4 text-base font-semibold text-[#111311] transition hover:bg-[#f4f1ea]"
        >
          ← Anterior
        </button>
        <button
          type="button"
          onClick={() => go(last ? 0 : index + 1)}
          className="inline-flex min-h-14 flex-[1.4] items-center justify-center rounded-full bg-[#de6347] px-4 text-base font-semibold text-white shadow-[0_8px_20px_rgba(222,99,71,0.35)] transition hover:bg-[#c8553a]"
        >
          {last ? "↻ Volver al inicio" : "Siguiente lámina →"}
        </button>
      </div>

      {last ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={DOWNLOAD_PATH}
            className="inline-flex items-center justify-center rounded-full bg-[#111311] px-5 py-3.5 text-sm font-semibold text-[#e9e8e1] transition hover:bg-black"
          >
            Descargar propuesta extendida
          </a>
          <Link
            href={DEMO_BASE}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#de6347] bg-white px-5 py-3.5 text-sm font-semibold text-[#de6347] transition hover:bg-[#de6347] hover:text-white"
          >
            Ver demo del sitio
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-[#777d75]">
          Recorre las {TOTAL} láminas. Al final podrás descargar el Word y abrir la
          demo.
        </p>
      )}

      {last ? (
        <p className="mt-3 text-center text-xs text-[#777d75]">
          El Word tiene el detalle completo: alcance, exclusiones, responsabilidades
          y posibles etapas futuras.
        </p>
      ) : null}
    </div>
  );
}

function SideArrow({
  direction,
  label,
  onClick,
  emphasize,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  emphasize?: boolean;
}) {
  const next = direction === "next";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute bottom-3 z-20 grid h-14 w-14 place-items-center rounded-full border-0 shadow-[0_10px_28px_rgba(0,0,0,0.28)] sm:bottom-4 sm:h-16 sm:w-16 ${
        next
          ? "right-3 sm:right-4"
          : "left-3 sm:left-4"
      } ${
        emphasize
          ? "bg-[#de6347] text-white hover:bg-[#c8553a]"
          : "bg-white text-[#111311] hover:bg-[#f4f1ea]"
      }`}
    >
      <span aria-hidden className="text-3xl leading-none sm:text-4xl">
        {next ? "→" : "←"}
      </span>
    </button>
  );
}

function Slide({
  children,
  dark,
  photo,
}: {
  children: React.ReactNode;
  dark?: boolean;
  photo?: boolean;
}) {
  return (
    <section
      className={`relative flex min-h-[46rem] min-w-full flex-col overflow-hidden sm:min-h-[36rem] ${
        dark ? "bg-[#111311] text-[#e9e8e1]" : "bg-[#f4f1ea] text-[#171b18]"
      }`}
    >
      {photo ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kitchencare-demo/images/horno.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "rgba(17, 19, 17, 0.78)" }}
            aria-hidden
          />
        </>
      ) : null}
      <div className="relative z-10 flex min-h-[46rem] flex-1 flex-col gap-4 p-6 pb-20 sm:min-h-[36rem] sm:gap-[18px] sm:p-10 sm:pb-24">
        {children}
      </div>
    </section>
  );
}

function Pill({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
        light
          ? "border-[#c9cec5] text-[#5e695f]"
          : "border-[#454c44] text-[#c3c9c0]"
      }`}
    >
      {children}
    </span>
  );
}

function Item({
  icon,
  title,
  copy,
  dark,
}: {
  icon: string;
  title: string;
  copy: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border text-sm ${
          dark
            ? "border-[#424a40] text-[#c3ccc1]"
            : "border-[#cbd0c8] text-[#4d6252]"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold leading-tight">{title}</p>
        <p
          className={`mt-1 text-[11px] leading-snug ${
            dark ? "text-[#929b91]" : "text-[#767d74]"
          }`}
        >
          {copy}
        </p>
      </div>
    </div>
  );
}

function SlideFooter({
  meta,
  light,
}: {
  meta: string;
  light?: boolean;
}) {
  return (
    <div>
      <span
        className={`text-[10px] tracking-[0.12em] ${
          light ? "text-[#8a9088]" : "text-[#8a9088]"
        }`}
      >
        {meta}
      </span>
    </div>
  );
}
