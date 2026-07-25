"use client";

import { useCallback, useEffect, useState } from "react";

export function useGuestName(eventToken: string) {
  const storageKey = `shutterchance_guest_name_${eventToken}`;

  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem(storageKey);

    if (savedName) {
      setGuestName(savedName);
    }
  }, [storageKey]);

  const saveGuestName = useCallback(
    (name: string) => {
      localStorage.setItem(storageKey, name);
      setGuestName(name);
    },
    [storageKey]
  );

  const clearGuestName = useCallback(() => {
    localStorage.removeItem(storageKey);
    setGuestName("");
  }, [storageKey]);

  return {
    guestName,
    saveGuestName,
    clearGuestName,
  };
}