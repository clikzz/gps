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

const LAST_CHECK_KEY = "lastBadgeCheck";
const LAST_CHECK_TIMESTAMP_KEY = "lastBadgeCheckTimestamp";
const MAX_AGE_DAYS = 30; 

export function BadgeListenerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Badge[]>([]);
  const [current, setCurrent] = useState<Badge | null>(null);
  const lastCheck = useRef<string>(new Date(0).toISOString());
  const firstRun = useRef(true);

  const handleClose = () => setCurrent(null);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_CHECK_KEY);
    const storedAt = localStorage.getItem(LAST_CHECK_TIMESTAMP_KEY);

    const now = new Date().getTime();
    const thirtyDaysMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    if (stored && storedAt && now - new Date(storedAt).getTime() < thirtyDaysMs) {
      lastCheck.current = stored;
    } else {
      localStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());
      localStorage.setItem(LAST_CHECK_TIMESTAMP_KEY, new Date().toISOString());
    }

    const poll = async () => {
      try {
        const url = new URL("/api/badges/new", window.location.origin);
        url.searchParams.set("since", lastCheck.current);

        const res = await fetch(url.toString(), { credentials: "include" });
        if (!res.ok) return;

        const badges: Badge[] = await res.json();

        if (badges.length > 0) {
          lastCheck.current = badges[badges.length - 1].awardedAt;
          localStorage.setItem(LAST_CHECK_KEY, lastCheck.current);
          localStorage.setItem(LAST_CHECK_TIMESTAMP_KEY, new Date().toISOString());

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
    const interval = setInterval(poll, 5_000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [queue, current]);

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
