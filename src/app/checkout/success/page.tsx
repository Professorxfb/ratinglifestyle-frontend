import { Suspense } from "react";
import Link from "next/link";

function SuccessInner({ order }: { order?: string }) {
  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-success text-4xl text-success">
        ✓
      </span>
      <h1 className="mt-6 font-display text-4xl text-ink">Thank You!</h1>
      <p className="mt-3 max-w-md text-muted">
        Your order has been placed successfully. A confirmation will be sent to you shortly.
      </p>
      {order && (
        <p className="mt-5 rounded-sm border border-gold/40 bg-card px-6 py-3 text-sm">
          Order Number: <span className="font-semibold tracking-wide text-gold">{order}</span>
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/account/orders" className="btn-gold">Track Your Order</Link>
        <Link href="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <Suspense>
      <SuccessInner order={searchParams.order} />
    </Suspense>
  );
}
