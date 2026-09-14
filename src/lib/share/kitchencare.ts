import { ACCESS_PATH, DEMO_BASE, DOWNLOAD_PATH, PROPOSAL_PATH } from "@/kitchencare/lib/constants";

export const KITCHENCARE_SHARE_COOKIE = "kitchencare_share";
export const KITCHENCARE_SHARE_SCOPE = "kc";
/** 14 días: suficiente para revisar la propuesta. */
export const KITCHENCARE_SHARE_MAX_AGE_SEC = 60 * 60 * 24 * 14;

export const KITCHENCARE_SHARE = {
  acceso: ACCESS_PATH,
  proposal: PROPOSAL_PATH,
  demo: DEMO_BASE,
  download: DOWNLOAD_PATH,
} as const;

export function getKitchenCareSharePassword(): string | undefined {
  const value = process.env.KITCHENCARE_SHARE_PASSWORD?.trim();
  return value || undefined;
}

export function isKitchenCareSharePath(pathname: string): boolean {
  return (
    pathname === "/p/kitchencare" ||
    pathname.startsWith("/p/kitchencare/") ||
    pathname === "/api/p/kitchencare" ||
    pathname.startsWith("/api/p/kitchencare/")
  );
}

export function isKitchenCareAccessPath(pathname: string): boolean {
  return pathname === ACCESS_PATH || pathname.startsWith(`${ACCESS_PATH}/`);
}

export function safeKitchenCareNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/p/kitchencare") || raw.startsWith("//")) {
    return PROPOSAL_PATH;
  }
  if (raw.startsWith(ACCESS_PATH)) return PROPOSAL_PATH;
  return raw;
}

export function kitchenCareShareCookieOptions(maxAge = KITCHENCARE_SHARE_MAX_AGE_SEC) {
  return {
    name: KITCHENCARE_SHARE_COOKIE,
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
