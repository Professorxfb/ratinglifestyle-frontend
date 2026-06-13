import Link from "next/link";
import Placeholder from "@/components/ui/Placeholder";

// Split-screen luxury auth layout: editorial image left, form card right.
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-2">
      {/* Editorial side */}
      <div className="relative hidden lg:block">
        <Placeholder seed={42} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <p className="font-logo text-2xl tracking-luxe text-ink">
            RUPKOTHA <span className="text-gold">TRENDZ</span>
          </p>
          <p className="mt-3 font-display text-3xl leading-tight text-ink">
            Wear the Story.
          </p>
          <p className="mt-2 text-sm text-platinum/70">
            Premium fashion, crafted in Bangladesh.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="font-logo text-lg tracking-luxe text-ink lg:hidden">
            RUPKOTHA <span className="text-gold">TRENDZ</span>
          </Link>
          <h1 className="mt-8 font-display text-3xl text-ink lg:mt-0">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
