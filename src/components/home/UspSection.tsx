import Reveal from "@/components/ui/Reveal";

const usps = [
  {
    title: "Free Shipping",
    text: "Complimentary delivery on all orders above ৳1500, nationwide.",
    icon: (
      <path d="M3 7h11v8H3V7zm11 3h4l3 3v2h-7v-5zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    ),
  },
  {
    title: "Easy Returns",
    text: "Not in love with it? Return within 7 days, hassle-free.",
    icon: <path d="M3 12a9 9 0 1 1 3 6.7M3 12V7m0 5h5" />,
  },
  {
    title: "100% Authentic",
    text: "Every piece is crafted with premium, ethically sourced fabric.",
    icon: <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4zm-1 12l5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3z" />,
  },
];

export default function UspSection() {
  return (
    <section className="border-y border-line bg-charcoal">
      <div className="container-luxe grid grid-cols-1 gap-6 py-14 sm:grid-cols-3">
        {usps.map((usp, i) => (
          <Reveal key={usp.title} delay={i * 0.1}>
            <div className="flex flex-col items-center gap-4 rounded-sm border border-line bg-card p-8 text-center transition-colors hover:border-gold/50">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {usp.icon}
                </svg>
              </span>
              <h3 className="font-display text-xl text-ink">{usp.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{usp.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
