"use client";

import { useEffect } from "react";


export function useBodyLock() {

  useEffect(() => {

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {

      html.style.overflow = "";
      body.style.overflow = "";

      body.style.position = "";
      body.style.top = "";
      body.style.width = "";

      window.scrollTo(
        0,
        scrollY
      );
    };

  }, []);

}