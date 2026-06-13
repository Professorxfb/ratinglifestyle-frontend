import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl text-gold sm:text-9xl">404</p>
      <h1 className="mt-4 font-display text-3xl text-ink">Page Not Found</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you’re looking for has moved or no longer exists. Let’s get you back to
        something beautiful.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-gold">
          Back to Home
        </Link>
        <Link href="/shop" className="btn-outline">
          Shop All
        </Link>
      </div>
    </div>
  );
}
