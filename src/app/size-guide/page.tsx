import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { ProseList } from "@/components/info/Prose";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "Find your perfect fit with the Rupkotha Trendz size guide for Men, Women and Kids. All measurements in inches.",
};

interface SizeTable {
  heading: string;
  columns: string[];
  rows: string[][];
}

const TABLES: SizeTable[] = [
  {
    heading: "Men — Tops",
    columns: ["Size", "Chest", "Length", "Shoulder"],
    rows: [
      ["S", "36–38", "27", "17"],
      ["M", "38–40", "28", "18"],
      ["L", "40–42", "29", "19"],
      ["XL", "42–44", "30", "20"],
      ["XXL", "44–46", "31", "21"],
    ],
  },
  {
    heading: "Women — Tops",
    columns: ["Size", "Bust", "Waist", "Length"],
    rows: [
      ["XS", "31–32", "24–25", "24"],
      ["S", "33–34", "26–27", "25"],
      ["M", "35–36", "28–29", "26"],
      ["L", "37–39", "30–32", "27"],
      ["XL", "40–42", "33–35", "28"],
    ],
  },
  {
    heading: "Kids",
    columns: ["Size (Age)", "Chest", "Height", "Waist"],
    rows: [
      ["2–3 Y", "21", "37–40", "20"],
      ["4–5 Y", "23", "41–45", "21"],
      ["6–7 Y", "25", "46–50", "22"],
      ["8–9 Y", "27", "51–54", "23"],
      ["10–12 Y", "29", "55–59", "24"],
    ],
  },
];

function Table({ table }: { table: SizeTable }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl text-gold">{table.heading}</h2>
      <div className="overflow-x-auto rounded-sm border border-line">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-line bg-charcoal text-left text-xs uppercase tracking-wide text-gold">
              {table.columns.map((c) => (
                <th key={c} className="px-4 py-3">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-line/50 last:border-0 text-ink/80">
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-3 ${j === 0 ? "font-semibold text-ink" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function SizeGuidePage() {
  return (
    <>
      <PageHeader
        title="Size Guide"
        description="Measurements are in inches. When you're between sizes, we recommend sizing up for a relaxed fit."
        crumbs={[{ label: "Home", href: "/" }, { label: "Size Guide" }]}
      />
      <div className="container-luxe py-14">
        <div className="mx-auto max-w-3xl space-y-12">
          {TABLES.map((t) => (
            <Table key={t.heading} table={t} />
          ))}

          <section className="rounded-sm border border-line bg-card p-8">
            <h2 className="font-display text-xl text-ink">How to measure</h2>
            <div className="mt-4 text-sm leading-relaxed text-ink/75">
              <ProseList
                items={[
                  <><strong className="text-ink">Chest / Bust:</strong> measure around the fullest part, keeping the tape level.</>,
                  <><strong className="text-ink">Waist:</strong> measure around the narrowest part of your natural waistline.</>,
                  <><strong className="text-ink">Length:</strong> measure from the highest point of the shoulder down to the desired hem.</>,
                  <><strong className="text-ink">Shoulder:</strong> measure across the back, from one shoulder seam to the other.</>,
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
