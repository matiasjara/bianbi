"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DEMO_BASE,
  DOWNLOAD_PATH,
} from "@/kitchencare/lib/constants";

const TOTAL = 5;

export function ProposalCarousel() {
  const [index, setIndex] = useState(0);

  function go(n: number) {
    setIndex((n + TOTAL) % TOTAL);
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 py-6 sm:px-5 sm:py-8">
      <div className="mb-3 flex items-center justify-between text-[11px] font-bold tracking-[0.14em] text-[#777d75]">
        <span>KITCHENCARE</span>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </div>

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
            <SlideFooter meta="Una nueva etapa para el negocio.">
              <Arrow onClick={() => go(index + 1)}>→</Arrow>
            </SlideFooter>
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
            <SlideFooter meta="Diseño + Tecnología + Estrategia" light>
              <div className="flex gap-2">
                <Arrow light onClick={() => go(index - 1)}>←</Arrow>
                <Arrow light onClick={() => go(index + 1)}>→</Arrow>
              </div>
            </SlideFooter>
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
            <SlideFooter meta="Probar → Medir → Aprender">
              <div className="flex gap-2">
                <Arrow onClick={() => go(index - 1)}>←</Arrow>
                <Arrow onClick={() => go(index + 1)}>→</Arrow>
              </div>
            </SlideFooter>
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
            <SlideFooter meta="Pagos en UF según valor del día de cobro" light>
              <div className="flex gap-2">
                <Arrow light onClick={() => go(index - 1)}>←</Arrow>
                <Arrow light onClick={() => go(index + 1)}>→</Arrow>
              </div>
            </SlideFooter>
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
            <SlideFooter meta="“Tu cocina, siempre funcionando.”">
              <Arrow onClick={() => go(0)}>↻</Arrow>
            </SlideFooter>
          </Slide>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a la lámina ${i + 1}`}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full border-0 transition-all ${
              i === index ? "w-[22px] bg-[#667d6b]" : "w-1.5 bg-[#c5cbc3]"
            }`}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={DOWNLOAD_PATH}
          className="inline-flex items-center justify-center rounded-full bg-[#111311] px-5 py-3 text-sm font-semibold text-[#e9e8e1] transition hover:bg-black"
        >
          Descargar propuesta extendida
        </a>
        <Link
          href={DEMO_BASE}
          className="inline-flex items-center justify-center rounded-full bg-[#de6347] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c8553a]"
        >
          Ver demo del sitio
        </Link>
      </div>
      <p className="mt-3 text-center text-xs text-[#777d75]">
        El Word tiene el detalle completo: alcance, exclusiones, responsabilidades
        y posibles etapas futuras.
      </p>
    </div>
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
      className={`relative min-w-full overflow-hidden ${
        dark ? "bg-[#111311] text-[#e9e8e1]" : "bg-[#f4f1ea] text-[#171b18]"
      }`}
      style={{ height: "clamp(420px, 62vw, 560px)" }}
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
      <div className="relative z-10 grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-4 p-6 sm:gap-[18px] sm:p-10">
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
  children,
  light,
}: {
  meta: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`text-[10px] tracking-[0.12em] ${
          light ? "text-[#8a9088]" : "text-[#8a9088]"
        }`}
      >
        {meta}
      </span>
      {children}
    </div>
  );
}

function Arrow({
  children,
  onClick,
  light,
}: {
  children: React.ReactNode;
  onClick: () => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-full border text-lg ${
        light
          ? "border-[#c5ccc1] bg-white text-[#1b211c]"
          : "border-[#485047] bg-[#222620] text-[#f5f3ec]"
      }`}
    >
      {children}
    </button>
  );
}
