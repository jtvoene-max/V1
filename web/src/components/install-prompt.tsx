"use client";

import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

// Registreert de service worker en biedt installeren aan op Android/desktop.
// iOS kent geen installatieprompt; daar krijgt de bezoeker de handmatige uitleg.
export function InstallPrompt() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const alGeinstalleerd = window.matchMedia("(display-mode: standalone)").matches;
    const weggeklikt = localStorage.getItem("si-install-dismissed") === "1";
    if (alGeinstalleerd || weggeklikt) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) setIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!prompt && !iosHint) return null;

  const sluit = () => {
    localStorage.setItem("si-install-dismissed", "1");
    setPrompt(null);
    setIosHint(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 border border-[#a8894f] bg-white p-4 shadow-[0_10px_36px_rgba(10,10,10,.18)] sm:left-auto sm:right-4 sm:w-80">
      <p className="caps-gold mb-2">Add to your home screen</p>
      <p className="text-sm leading-relaxed text-neutral-700">
        {prompt
          ? "Install Still Iconic for quick access to the collection, your orders and offers."
          : "Tap the share icon, then choose Add to Home Screen."}
      </p>
      <div className="mt-3 flex gap-2">
        {prompt && (
          <button
            className="btn-maison !px-4 !py-2"
            onClick={async () => {
              await prompt.prompt();
              await prompt.userChoice;
              sluit();
            }}
          >
            Install
          </button>
        )}
        <button className="btn-maison-line !px-4 !py-2" onClick={sluit}>
          Not now
        </button>
      </div>
    </div>
  );
}
