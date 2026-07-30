import type { Decision } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Decision records.
 *
 * Collapsed by default, because the titles alone are a readable summary of
 * how the thing was built and the detail is for whoever wants it. Built on
 * the Radix accordion so the disclosure state, `aria-expanded`, and arrow-key
 * navigation are correct without reimplementing them.
 *
 * Every record shows its trade-off. That is the entire reason this section
 * exists — a list of decisions with the costs removed is a list of features.
 */
export function Decisions({ decisions }: { decisions: Decision[] }) {
  return (
    <Accordion
      type="multiple"
      className="w-full border-t border-hairline"
    >
      {decisions.map((decision, i) => (
        <AccordionItem
          key={decision.id}
          value={decision.id}
          className="border-b border-hairline"
        >
          <AccordionTrigger className="group/dec gap-6 py-7 text-left hover:no-underline">
            <span className="flex flex-1 items-baseline gap-5">
              <span
                data-numeric
                className="label-mono shrink-0 transition-colors duration-500 group-hover/dec:text-cyan-soft"
              >
                D{String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-lg font-medium tracking-[-0.02em] text-ink md:text-xl">
                {decision.title}
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="pb-10">
            <dl className="grid gap-8 pl-0 md:grid-cols-3 md:gap-10 md:pl-[3.6rem]">
              <Field term="Context" detail={decision.context} />
              <Field term="Decision" detail={decision.decision} />
              <Field term="Trade-off" detail={decision.tradeoff} accent />
            </dl>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Field({
  term,
  detail,
  accent = false,
}: {
  term: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div>
      <dt
        className={
          accent
            ? "label-mono text-violet-soft/80"
            : "label-mono"
        }
      >
        {term}
      </dt>
      <dd className="mt-3 text-sm leading-relaxed text-ink-secondary">
        {detail}
      </dd>
    </div>
  );
}
