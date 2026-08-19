import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { clsx } from "clsx";

export type AlertProps = {
  title: string;
  description: string;
  variant: "info" | "success" | "warning" | "danger";
};

const styles = {
  info: "border-cobalt/25 bg-blue-50 text-blue-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  danger: "border-red-200 bg-red-50 text-red-950",
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

export function Alert({ title, description, variant }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div className={clsx("my-8 rounded-md border p-5 shadow-sm", styles[variant])}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 opacity-85">{description}</p>
        </div>
      </div>
    </div>
  );
}
