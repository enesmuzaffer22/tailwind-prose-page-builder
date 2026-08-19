"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      title="Sil"
      aria-label="Sayfayi sil"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Bu sayfa silinsin mi?")) {
          event.preventDefault();
        }
      }}
      className="grid h-9 w-9 place-items-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export function DeletePageButton({ action, id }: { action: (formData: FormData) => void; id: number }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
