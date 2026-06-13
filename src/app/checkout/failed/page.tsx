import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-danger text-4xl text-danger">
        ✕
      </span>
      <h1 className="mt-6 font-display text-4xl text-ink">Payment Failed</h1>
      <p className="mt-3 max-w-md text-muted">
        We couldn’t process your payment. Your bag has been saved — please try again or choose a
        different payment method.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/checkout" className="btn-gold">Try Again</Link>
        <Link href="/cart" className="btn-outline">Back to Bag</Link>
      </div>
    </div>
  );
}
