import { LoginButtons } from "@/components/login-buttons";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="lyvee-gradient flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border bg-white p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">Lyvee.link</p>
          <h1 className="text-3xl font-bold tracking-tight">Verkaufslink erstellen</h1>
          <p className="text-muted-foreground">Melde dich an und erstelle deinen ersten Link in unter 30 Sekunden.</p>
        </div>
        <LoginButtons />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Durch die Anmeldung akzeptierst du die Beta-Bedingungen und Datenschutz-Hinweise.
        </p>
      </div>
    </main>
  );
}
