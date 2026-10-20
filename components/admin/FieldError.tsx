export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-800">
      {message}
    </p>
  );
}

export function FormMessage({ state }: { state: { ok?: boolean; message?: string } }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={
        state.ok
          ? "rounded-xs bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          : "rounded-xs bg-red-50 px-3 py-2 text-sm text-red-800"
      }
    >
      {state.message}
    </p>
  );
}
