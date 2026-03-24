"use client";

import { useEffect } from "react";
import { hydrateSiteAccent } from "@/lib/site-theme";

export default function SiteThemeHydration() {
  useEffect(() => {
    hydrateSiteAccent();
  }, []);
  return null;
}
