"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { buttonBase, buttonVariants } from "@/components/ui/ButtonLink";
import { trackEvent } from "@/lib/analytics/events";
import { telHref, whatsappHref } from "@/lib/contact";
import { mainNav, sectorLinks, ui } from "@/lib/content/site";
import { cn } from "@/lib/utils";

import { Logo } from "./Logo";
import { TrackedLink } from "./TrackedLink";

type HeaderProps = {
  phone: string;
  whatsapp: string;
};

/**
 * Sticky site header. Every public page opens on a dark band, so the header is
 * transparent at the top and turns solid once the page scrolls.
 */
export function Header({ phone, whatsapp }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Full-screen menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-arch",
        scrolled || open
          ? "border-b border-line-dark bg-ink-950"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-site flex h-(--header-height) items-center justify-between gap-6">
        <Logo variant="dark" size="md" taglineClassName="hidden sm:block" />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative py-2 text-[15px] font-semibold text-muted-on-dark transition-colors duration-300 hover:text-ivory"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-arch group-hover:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <TrackedLink
            href={telHref(phone)}
            event="call_click"
            placement="header"
            className="hidden min-h-11 items-center gap-2 px-2 text-sm font-semibold text-muted-on-dark transition-colors hover:text-ivory xl:inline-flex"
          >
            <PhoneIcon size={18} />
            {phone}
          </TrackedLink>
          <Link
            href="/contact#quote"
            onClick={() => trackEvent("estimate_click", { placement: "header" })}
            className={cn(buttonBase, buttonVariants.gold, "hidden px-5 sm:inline-flex")}
          >
            {ui.freeEstimate}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? ui.closeMenu : ui.openMenu}
            className="-mr-2 inline-flex size-11 items-center justify-center text-ivory lg:hidden"
          >
            {open ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ui.menu}
        hidden={!open}
        className="fixed inset-x-0 top-(--header-height) bottom-0 overflow-y-auto bg-ink-950 lg:hidden"
      >
        <div className="container-site flex min-h-full flex-col pt-8 pb-10">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {mainNav.map((item, i) => (
                <li key={item.href} className="border-b border-line-dark">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-16 items-center gap-4 font-display text-[28px] font-semibold tracking-(--tracking-display) text-ivory"
                  >
                    <span className="w-7 font-sans text-xs font-bold text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-1">
            {sectorLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="flex min-h-11 items-center text-sm font-semibold text-muted-on-dark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto grid gap-3 pt-10">
            <Link
              href="/contact#quote"
              onClick={() => {
                trackEvent("estimate_click", { placement: "mobile_menu" });
                setOpen(false);
              }}
              className={cn(buttonBase, buttonVariants.gold, "w-full")}
            >
              {ui.freeEstimate}
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <TrackedLink
                href={telHref(phone)}
                event="call_click"
                placement="mobile_menu"
                className={cn(buttonBase, buttonVariants["outline-dark"], "px-3")}
              >
                <PhoneIcon size={18} />
                {ui.call}
              </TrackedLink>
              <TrackedLink
                href={whatsappHref(whatsapp, ui.whatsappGreeting)}
                event="whatsapp_click"
                placement="mobile_menu"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonBase, buttonVariants["outline-dark"], "px-3")}
              >
                <WhatsAppIcon size={18} />
                {ui.whatsapp}
              </TrackedLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
