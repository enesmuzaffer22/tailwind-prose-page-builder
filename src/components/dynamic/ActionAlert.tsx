"use client";

import { BellRing, CheckCircle2, TriangleAlert } from "lucide-react";
import { useState } from "react";

export type ActionAlertProps = {
  title: string;
  description: string;
  buttonText: string;
  alertMessage: string;
  variant: "neutral" | "success" | "warning";
};

const variants = {
  neutral: {
    wrapper: "border-ink/10 bg-white",
    button: "bg-ink text-white hover:bg-cobalt",
    icon: BellRing,
  },
  success: {
    wrapper: "border-emerald-200 bg-emerald-50",
    button: "bg-emerald-700 text-white hover:bg-emerald-900",
    icon: CheckCircle2,
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50",
    button: "bg-amber-500 text-ink hover:bg-saffron",
    icon: TriangleAlert,
  },
};

export function ActionAlert({ title, description, buttonText, alertMessage, variant }: ActionAlertProps) {
  const [lastAction, setLastAction] = useState("");
  const selected = variants[variant];
  const Icon = selected.icon;

  return (
    <section className={`my-10 rounded-md border p-6 shadow-soft ${selected.wrapper}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-mint text-cobalt">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/64">{description}</p>
            {lastAction ? <p className="mt-3 text-sm font-medium text-cobalt">{lastAction}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            window.alert(alertMessage);
            setLastAction("Alert tetiklendi.");
          }}
          className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold transition ${selected.button}`}
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}
