/** App Shell fallback for detail pages while their content streams in. */
export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="bg-ink-950 pt-(--header-height)">
      <div className="container-site pt-12 pb-16">
        <div className="h-3 w-40 rounded-xs bg-ink-800" />
        <div className="mt-14 h-3 w-56 rounded-xs bg-ink-800" />
        <div className="mt-6 h-12 w-full max-w-2xl rounded-xs bg-ink-800" />
        <div className="mt-12 aspect-[4/3] w-full rounded-xs bg-ink-900 sm:aspect-video lg:aspect-[21/9]" />
      </div>
    </div>
  );
}
