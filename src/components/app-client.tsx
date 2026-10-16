"use client";

import { RuntimeApp } from "./runtime-app";
import type { Blueprint } from "@/lib/blueprint";

/** /app is a server component; the runtime needs the browser (localStorage). */
export function AppClient({ bp }: { bp: Blueprint }) {
  return <RuntimeApp bp={bp} />;
}
