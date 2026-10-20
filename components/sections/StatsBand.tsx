import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { statLabels } from "@/lib/content/home";
import type { SiteStats } from "@/lib/data/settings";

export function StatsBand({ stats }: { stats: SiteStats }) {
  const items = (Object.keys(statLabels) as (keyof SiteStats)[]).map((key) => ({
    key,
    value: stats[key],
    label: statLabels[key],
  }));

  return (
    <section aria-label="Company in numbers" className="bg-ink-900 text-ivory">
      <dl className="container-site grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            key={item.key}
            delay={i * 90}
            className="flex flex-col-reverse gap-2 border-line-dark py-10 max-lg:odd:border-r max-lg:odd:pr-4 max-lg:even:pl-5 max-lg:nth-[-n+2]:border-b sm:py-12 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
          >
            <dt className="text-sm font-semibold text-muted-on-dark">{item.label}</dt>
            <dd className="font-display text-[40px] leading-none font-bold tracking-(--tracking-display) text-gold sm:text-5xl lg:text-[56px]">
              <CountUp value={item.value} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
