// Small inline SVG icon set. Decorative by default (aria-hidden); give the
// parent control an aria-label when the icon is its only content.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Stroke({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

function Fill({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
    </Stroke>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </Stroke>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Stroke>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 7h18M3 12h18M9 17h12" />
    </Stroke>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </Stroke>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Stroke>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="5" y="4" width="14" height="17" rx="1.5" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
    </Stroke>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Fill {...props}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.07.9.92-2.98-.2-.31a8.2 8.2 0 1 1 6.85 3.72Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.73 2.73 0 0 0-.85 2.03 4.74 4.74 0 0 0 1 2.52 10.86 10.86 0 0 0 4.16 3.67c1.55.67 2.15.73 2.93.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.17-.47-.29Z" />
    </Fill>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Fill {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A20.7 20.7 0 0 0 14.3 4.3c-2.24 0-3.78 1.37-3.78 3.88v2.32H8v3h2.52V21h2.98Z" />
    </Fill>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <Fill {...props}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </Fill>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <Fill {...props}>
      <path d="M16.6 3h-3.1v12.2a2.7 2.7 0 1 1-2.7-2.7c.27 0 .53.04.78.12V9.45a5.8 5.8 0 1 0 5.02 5.75V9.06A7.3 7.3 0 0 0 21 10.4V7.33a4.3 4.3 0 0 1-4.4-4.33Z" />
    </Fill>
  );
}
