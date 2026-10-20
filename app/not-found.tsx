import { NotFoundContent } from "@/components/sections/NotFoundContent";

import SiteLayout from "./(site)/layout";

// Unmatched URLs render outside the (site) route group, so wrap them in the site shell.
export default function GlobalNotFound() {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  );
}
