import { t } from "@/lib/i18n";

export const metadata = { title: "Offline — Still Iconic" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="caps-gold mb-3">{t.offline.voorregel}</p>
      <h1 className="font-serif text-3xl">{t.offline.titel}</h1>
      <div className="goud-lijn mx-auto my-5" />
      <p className="text-sm leading-relaxed text-neutral-600">
        {t.offline.tekst}
      </p>
    </main>
  );
}
