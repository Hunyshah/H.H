"use client";

import { startTransition, useActionState, type FormEvent } from "react";

import { initialFormState, type FormState } from "@/lib/actions/admin/state";

/**
 * useActionState without React 19's automatic form reset: dispatching from
 * onSubmit keeps what the admin typed when the server returns errors.
 */
export function useFormAction(action: (prev: FormState, data: FormData) => Promise<FormState>) {
  const [state, dispatch, pending] = useActionState(action, initialFormState);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => dispatch(data));
  };
  return { state, pending, onSubmit };
}
