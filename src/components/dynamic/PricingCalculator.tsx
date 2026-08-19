"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export type PricingCalculatorProps = {
  title: string;
  unitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  currency: string;
};

export function PricingCalculator({
  title,
  unitPrice,
  minQuantity,
  maxQuantity,
  currency,
}: PricingCalculatorProps) {
  const [quantity, setQuantity] = useState(minQuantity);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency],
  );

  const total = quantity * unitPrice;

  return (
    <section className="my-10 rounded-md border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-ink/62">Birim fiyat: {formatter.format(unitPrice)}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            title="Azalt"
            aria-label="Adedi azalt"
            onClick={() => setQuantity((value) => Math.max(minQuantity, value - 1))}
            className="grid h-10 w-10 place-items-center rounded-md border border-ink/15 bg-paper text-ink transition hover:bg-mint"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <output className="grid h-12 min-w-20 place-items-center rounded-md border border-ink/10 bg-ink px-4 text-lg font-semibold text-white">
            {quantity}
          </output>
          <button
            type="button"
            title="Artir"
            aria-label="Adedi artir"
            onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
            className="grid h-10 w-10 place-items-center rounded-md border border-ink/15 bg-paper text-ink transition hover:bg-mint"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-ink/10 pt-5">
        <span className="text-sm text-ink/62">Toplam</span>
        <strong className="ml-3 text-2xl text-coral">{formatter.format(total)}</strong>
      </div>
    </section>
  );
}
