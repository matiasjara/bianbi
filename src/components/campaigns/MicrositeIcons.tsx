import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function base(props: IconProps, children: ReactNode) {
  const { title, className, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconCalendar(p: IconProps) {
  return base(
    p,
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>,
  );
}

export function IconPin(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
  );
}

export function IconBolt(p: IconProps) {
  return base(p, <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />);
}

export function IconSpark(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <circle cx="12" cy="12" r="3.5" />
    </>,
  );
}

export function IconSun(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>,
  );
}

export function IconTrain(p: IconProps) {
  return base(
    p,
    <>
      <rect x="5" y="4" width="14" height="13" rx="2" />
      <path d="M5 11h14M9 17l-2 3M15 17l2 3M9 14.5h.01M15 14.5h.01" />
    </>,
  );
}

export function IconTip(p: IconProps) {
  return base(
    p,
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3 11.2V16h6v-1.8A6 6 0 0 0 12 3z" />
    </>,
  );
}

export function IconHome(p: IconProps) {
  return base(
    p,
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
    </>,
  );
}

export function IconHelp(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 2.3" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </>,
  );
}

export function IconWalk(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="13" cy="5" r="2" />
      <path d="M9 21l2-6 3 2 3 4M8 12l3-3 3 2 2-1" />
    </>,
  );
}

export function IconShare(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.3 13.2 15.7 17.3M15.7 6.7 8.3 10.8" />
    </>,
  );
}
