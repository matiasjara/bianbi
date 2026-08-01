import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function base(props: P, children: ReactNode) {
  const { className, ...rest } = props;
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Iconografía BIANBI — línea hand-drawn */
export function IconCoffee(p: P) {
  return base(
    p,
    <>
      <path d="M14 18h16a1 1 0 0 1 1 1v8c0 5-4 9-9 9s-9-4-9-9v-8a1 1 0 0 1 1-1z" />
      <path d="M31 21h3.5a3.5 3.5 0 0 1 0 7H31" />
      <path d="M13 38h18" />
      <path d="M20 10c0 2 .8 3 2 4M25 9c0 2.2 1 3.4 2.4 4.4" />
    </>,
  );
}

export function IconDining(p: P) {
  return base(
    p,
    <>
      <path d="M16 10v18M13 10c0 4 3 5 3 9M19 10c0 4-3 5-3 9" />
      <path d="M30 10v8c0 3-2 4-2 7v3" />
      <path d="M28 18h4" />
      <path d="M16 38v-6M30 38v-6" />
    </>,
  );
}

export function IconCamera(p: P) {
  return base(
    p,
    <>
      <rect x="8" y="16" width="32" height="22" rx="4" />
      <circle cx="24" cy="27" r="6.5" />
      <path d="M17 16l2.5-5h9L31 16" />
      <circle cx="34" cy="22" r="1.2" fill="currentColor" stroke="none" />
    </>,
  );
}

export function IconLandmark(p: P) {
  return base(
    p,
    <>
      <path d="M24 8v6" />
      <path d="M18 14h12l2 24H16l2-24z" />
      <path d="M14 38h20" />
      <path d="M22 22h4M22 28h4" />
    </>,
  );
}

export function IconStay(p: P) {
  return base(
    p,
    <>
      <path d="M12 36V20l12-8 12 8v16" />
      <path d="M20 36v-10h8v10" />
      <path d="M10 36h28" />
    </>,
  );
}

export function IconMountains(p: P) {
  return base(
    p,
    <>
      <path d="M6 34l12-18 7 10 5-7 12 15" />
      <path d="M18 26l3.5-3.5L28 30" />
    </>,
  );
}

export function IconBike(p: P) {
  return base(
    p,
    <>
      <circle cx="14" cy="30" r="7" />
      <circle cx="34" cy="30" r="7" />
      <path d="M14 30l8-12h8l4 12" />
      <path d="M22 18h7" />
      <path d="M21 30h7" />
    </>,
  );
}

export function IconLuggage(p: P) {
  return base(
    p,
    <>
      <rect x="12" y="16" width="24" height="22" rx="3" />
      <path d="M19 16v-4h10v4" />
      <path d="M12 26h24" />
      <path d="M18 22v8M30 22v8" />
    </>,
  );
}

export function IconMusic(p: P) {
  return base(
    p,
    <>
      <path d="M20 34a4 4 0 1 1-0.1-1" />
      <path d="M20 33V14l14-4v16" />
      <path d="M34 26a4 4 0 1 1-0.1-1" />
    </>,
  );
}

export function IconStar(p: P) {
  return base(
    p,
    <path d="M24 8l4.2 9.2L38 18.5l-7.2 6.4L33 36l-9-5.2L15 36l2.2-11.1L10 18.5l9.8-1.3L24 8z" />,
  );
}

export function IconPin(p: P) {
  return base(
    p,
    <>
      <path d="M24 6c-7.2 0-13 5.6-13 13.2C11 30.2 24 42 24 42s13-11.8 13-22.8C37 11.6 31.2 6 24 6z" />
      <circle cx="24" cy="18.5" r="4.5" />
    </>,
  );
}

export function IconPlane(p: P) {
  return base(
    p,
    <>
      <path d="M8 26l32-10-14 14 2 8-6-5-8 3 4-8-10-2z" />
    </>,
  );
}
