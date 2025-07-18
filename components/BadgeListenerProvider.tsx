"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import BadgeCelebrationAlert from "./BadgeCelebrationAlert";

interface Badge {
  id: number;
  key: string;
  title: string;
  description: string;
  image?: string;
  awardedAt: string;
}

export function BadgeListenerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Badge[]>([]);
  const [current, setCurrent] = useState<Badge | null>(null);

  const lastCheck = useRef<string>(new Date(0).toISOString());
  const firstRun = useRef(true);

  const handleClose = () => setCurrent(null);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [queue, current]);

  useEffect(() => {
    const poll = async () => {
      try {
        const url = new URL("/api/badges/new", window.location.origin);
        url.searchParams.set("since", lastCheck.current);
        const res = await fetch(url.toString(), { credentials: "include" });
        if (!res.ok) return;
        const badges: Badge[] = await res.json();

        if (badges.length) {
          lastCheck.current = badges[badges.length - 1].awardedAt;

          if (!firstRun.current) {
            setQueue((q) => [...q, ...badges]);
          } else {
            firstRun.current = false;
          }
        }
      } catch {
      }
    };

    poll();                        
    const iv = setInterval(poll, 30_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {children}
      {current && (
        <BadgeCelebrationAlert
          isVisible
          badgeTitle={current.title}
          badgeDescription={current.description}
          badgeImage={current.image}
          onClose={handleClose}
        />
      )}
    </>
  );
}
