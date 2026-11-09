"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Current year, computed on the client so the static shell never goes stale. */
export default function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <span suppressHydrationWarning>{year}</span>;
}
