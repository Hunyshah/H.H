"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm, type FieldErrors } from "react-hook-form";

import { WhatsAppIcon } from "@/components/icons";
import { buttonBase, buttonVariants } from "@/components/ui/ButtonLink";
import { submitLead } from "@/lib/actions/leads";
import { trackEvent } from "@/lib/analytics/events";
import { whatsappHref } from "@/lib/contact";
import { quoteForm as copy } from "@/lib/content/forms";
import { clsx } from "clsx";
import {
  budgets,
  leadSchema,
  leadSteps,
  plotSizes,
  projectTypes,
  type LeadInput,
} from "@/lib/validations/lead";

type QuoteFormProps = {
  whatsapp: string;
  defaultProjectType?: LeadInput["projectType"];
};

const inputClass =
  "mt-2 block min-h-12 w-full rounded-xs border border-line bg-white px-4 text-base text-body placeholder:text-muted/70 transition-colors focus:border-ink-950 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold aria-invalid:border-red-700";
const selectClass =
  "appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2315112A' stroke-width='1.6'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-[length:20px] bg-[right_14px_center] bg-no-repeat pr-11";
const labelClass = "block text-sm font-bold text-body";

/**
 * Free estimate form. Phones get three short steps; tablets and desktops see
 * every field at once. Validation runs per step on mobile and in full on submit.
 */
export function QuoteForm({ whatsapp, defaultProjectType }: QuoteFormProps) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    getValues,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { projectType: defaultProjectType ?? projectTypeFromUrl(), message: "" },
    mode: "onTouched",
  });

  const lastStep = leadSteps.length - 1;

  // Choice fields (chips, selects) change without a blur, so re-check them on
  // change once they show an error; otherwise a stale message lingers.
  const choice = (name: "projectType" | "plotSize" | "budget") =>
    register(name, {
      onChange: () => {
        if (errors[name]) void trigger(name);
      },
    });

  const next = async () => {
    const ok = await trigger(leadSteps[step]);
    if (ok) setStep((s) => Math.min(lastStep, s + 1));
  };

  // On mobile, jump back to the first step that has an error.
  const onInvalid = (errs: FieldErrors<LeadInput>) => {
    const first = leadSteps.findIndex((fields) => fields.some((f) => errs[f]));
    if (first >= 0) setStep(first);
  };

  const onSubmit = (values: LeadInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitLead(values);
      if (result.ok) {
        trackEvent("lead", { project_type: values.projectType });
        setStatus("sent");
        return;
      }
      setStatus("error");
      setServerError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof LeadInput, { message });
      }
    });
  };

  if (status === "sent") {
    const v = getValues();
    const summary = `${copy.whatsappSummaryIntro}\nName: ${v.name}\nProject: ${v.projectType}\nPlot: ${v.plotSize}, ${v.location}\nBudget: ${v.budget}`;
    return (
      <div role="status" className="rounded-xs bg-ivory p-8 text-body sm:p-10">
        <p className="font-display text-2xl font-bold">{copy.sentTitle}</p>
        <p className="mt-3 text-muted">{copy.sentText}</p>
        <a
          href={whatsappHref(whatsapp, summary)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { placement: "quote_sent" })}
          className={clsx(buttonBase, "mt-8 bg-whatsapp px-6 text-ink-950 hover:brightness-95")}
        >
          <WhatsAppIcon size={20} />
          {copy.continueWhatsapp}
        </a>
      </div>
    );
  }

  const stepClass = (i: number) => clsx("grid gap-6", step !== i && "max-md:hidden");

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      aria-describedby={serverError ? "quote-error" : undefined}
      className="rounded-xs bg-ivory p-6 text-body sm:p-8 lg:p-10"
    >
      {/* Mobile step indicator */}
      <div className="mb-7 md:hidden">
        <p className="text-xs font-bold tracking-(--tracking-eyebrow) text-gold-text uppercase">
          {copy.stepLabel(step + 1, leadSteps.length)} · {copy.stepTitles[step]}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden="true">
          {leadSteps.map((_, i) => (
            <span key={i} className={clsx("h-0.5", i <= step ? "bg-gold" : "bg-line")} />
          ))}
        </div>
      </div>

      <div className="grid gap-8">
        {/* Step 1: project type */}
        <fieldset className={stepClass(0)}>
          <legend className={labelClass}>{copy.projectType}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {projectTypes.map((type) => (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  value={type}
                  {...choice("projectType")}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-11 items-center rounded-xs border border-line bg-white px-4 text-sm font-bold text-muted transition-colors peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold hover:border-ink-950">
                  {type}
                </span>
              </label>
            ))}
          </div>
          <FieldError message={errors.projectType?.message} />
        </fieldset>

        {/* Step 2: plot */}
        <div className={stepClass(1)}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="plotSize" className={labelClass}>
                {copy.plotSize}
              </label>
              <select
                id="plotSize"
                defaultValue=""
                aria-invalid={Boolean(errors.plotSize)}
                {...choice("plotSize")}
                className={clsx(inputClass, selectClass)}
              >
                <option value="" disabled>
                  {copy.select}
                </option>
                {plotSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <FieldError message={errors.plotSize?.message} />
            </div>
            <div>
              <label htmlFor="location" className={labelClass}>
                {copy.location}
              </label>
              <input
                id="location"
                type="text"
                autoComplete="address-level2"
                placeholder={copy.locationPlaceholder}
                aria-invalid={Boolean(errors.location)}
                {...register("location")}
                className={inputClass}
              />
              <FieldError message={errors.location?.message} />
            </div>
          </div>
        </div>

        {/* Step 3: contact */}
        <div className={stepClass(2)}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                {copy.name}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
                className={inputClass}
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                {copy.phone}
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="03xx-xxxxxxx"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
                className={inputClass}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>
          <div>
            <label htmlFor="budget" className={labelClass}>
              {copy.budget}
            </label>
            <select
              id="budget"
              defaultValue=""
              aria-invalid={Boolean(errors.budget)}
              {...choice("budget")}
              className={clsx(inputClass, selectClass)}
            >
              <option value="" disabled>
                {copy.select}
              </option>
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <FieldError message={errors.budget?.message} />
          </div>
          <div>
            <label htmlFor="message" className={labelClass}>
              {copy.message} <span className="font-normal text-muted">{copy.optional}</span>
            </label>
            <textarea
              id="message"
              rows={3}
              aria-invalid={Boolean(errors.message)}
              {...register("message")}
              className={clsx(inputClass, "py-3")}
            />
            <FieldError message={errors.message?.message} />
          </div>
        </div>
      </div>

      {serverError && (
        <p
          id="quote-error"
          role="alert"
          className="mt-6 rounded-xs bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {serverError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className={clsx(buttonBase, buttonVariants["outline-light"], "px-6 md:hidden")}
          >
            {copy.back}
          </button>
        )}
        {step < lastStep && (
          <button
            type="button"
            onClick={next}
            className={clsx(buttonBase, buttonVariants.gold, "flex-1 px-6 md:hidden")}
          >
            {copy.next}
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          className={clsx(
            buttonBase,
            "flex-1 bg-ink-950 px-6 text-ivory hover:bg-brand-purple disabled:opacity-60 md:flex-none md:px-10",
            step < lastStep && "max-md:hidden",
          )}
        >
          {pending ? copy.sending : copy.submit}
        </button>
      </div>
      <p className="mt-4 text-xs text-muted">{copy.privacy}</p>
    </form>
  );
}

/** Pre-selects the project type from `?type=` (e.g. links from project pages). */
function projectTypeFromUrl(): LeadInput["projectType"] | undefined {
  if (typeof window === "undefined") return undefined;
  const type = new URLSearchParams(window.location.search).get("type");
  return projectTypes.find((t) => t === type);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 text-sm text-red-800">
      {message}
    </p>
  );
}
