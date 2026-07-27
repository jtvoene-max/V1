export const metadata = { title: "Offline — Still Iconic" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="caps-gold mb-3">No connection</p>
      <h1 className="font-serif text-3xl">You are offline</h1>
      <div className="goud-lijn mx-auto my-5" />
      <p className="text-sm leading-relaxed text-neutral-600">
        We show prices and availability live, so this page needs a connection. Reconnect and try again.
      </p>
    </main>
  );
}
