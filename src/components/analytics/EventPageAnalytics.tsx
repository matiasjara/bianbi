"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Props = {
  slug: string;
  name: string;
};

export function EventPageAnalytics({ slug, name }: Props) {
  useEffect(() => {
    window.gtag?.("event", "event_view", {
      event_slug: slug,
      event_name: name,
    });
  }, [slug, name]);

  return null;
}

export function trackEventAccommodationClick(slug: string) {
  window.gtag?.("event", "event_accommodation_click", { event_slug: slug });
}
