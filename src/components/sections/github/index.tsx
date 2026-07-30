import { ArrowUpRight, GitFork, Star } from "lucide-react";

import { getGitHubSnapshot } from "@/lib/github";
import { cn } from "@/lib/utils";
import { Container, Section } from "@/components/primitives/layout";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealRule,
} from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";
import { Spotlight } from "@/components/primitives/spotlight";
import { UnderlineLink } from "@/components/primitives/links";
import { ContributionHeatmap } from "@/components/sections/github/contribution-heatmap";

/**
 * GitHub.
 *
 * A server component: the fetch, the token, and the caching all stay on the
 * server, so the client ships no API code and no credential. Rendered from a
 * snapshot that is guaranteed valid — see `lib/github.ts` for why this
 * section cannot fail the page.
 */
export async function GitHub() {
  const snapshot = await getGitHubSnapshot();
  const featured = snapshot.repos.slice(0, 4);

  return (
    <Section id="github">
      <Container>
        <RevealRule />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">06</span>
            <span className="label-mono text-ink-muted">GitHub</span>
          </Reveal>
          <Reveal>
            <UnderlineLink
              href={`https://github.com/${snapshot.login}`}
              target="_blank"
              rel="noreferrer noopener"
              className="label-mono py-2 -my-2 hover:text-ink"
            >
              @{snapshot.login}
            </UnderlineLink>
          </Reveal>
        </div>

        <div className="mt-stack grid gap-stack lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <TextReveal
              as="h2"
              text="The work, with its history attached."
              className="block max-w-[16ch] font-display text-title font-medium text-ink"
            />
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.1}>
              <p className="max-w-[44ch] text-lead text-ink-secondary">
                Repositories are the version of a project that cannot be art
                directed. Commit history shows what the case studies claim:
                where the hard parts were, and how many attempts each one took.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Totals */}
        <Reveal>
          <dl className="mt-section grid grid-cols-2 gap-px border-y border-hairline md:grid-cols-4">
            <Stat label="Public repos" value={snapshot.totals.repos} />
            <Stat label="Stars earned" value={snapshot.totals.stars} />
            <Stat label="Followers" value={snapshot.totals.followers} />
            <Stat
              label="Contributions"
              value={snapshot.calendar?.total ?? null}
            />
          </dl>
        </Reveal>

        {/* Contribution calendar */}
        <Reveal>
          <div className="mt-section">
            {snapshot.calendar ? (
              <ContributionHeatmap calendar={snapshot.calendar} />
            ) : (
              <DataNotice live={snapshot.live} />
            )}
          </div>
        </Reveal>

        {/* Repositories */}
        <div className="mt-section">
          <Reveal className="flex items-baseline justify-between gap-4">
            <h3 className="label-mono text-ink-muted">
              {snapshot.live ? "Recent repositories" : "Project repositories"}
            </h3>
            <span className="label-mono" data-numeric>
              {String(featured.length).padStart(2, "0")}
            </span>
          </Reveal>

          <RevealGroup
            className="mt-8 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2"
            stagger={0.06}
          >
            {featured.map((repo) => (
              <RevealItem key={repo.name} className="bg-ground">
                <Spotlight accent="cyan" className="h-full">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/card flex h-full flex-col p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-mono text-sm tracking-[0.02em] text-ink">
                        {repo.name}
                      </h4>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-ink-faint transition-all duration-500 ease-out-quiet group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-ink"
                      />
                    </div>

                    <p className="mt-4 max-w-[44ch] flex-1 text-sm leading-relaxed text-ink-muted">
                      {repo.description ?? "No description provided."}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-5">
                      {repo.language ? (
                        <span className="flex items-center gap-2 label-mono">
                          <span className="size-1.5 rounded-full bg-cyan-soft" />
                          {repo.language}
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1.5 label-mono">
                        <Star aria-hidden className="size-3" />
                        <span data-numeric>{repo.stars}</span>
                        <span className="sr-only">stars</span>
                      </span>
                      <span className="flex items-center gap-1.5 label-mono">
                        <GitFork aria-hidden className="size-3" />
                        <span data-numeric>{repo.forks}</span>
                        <span className="sr-only">forks</span>
                      </span>
                    </div>
                  </a>
                </Spotlight>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Language ecosystem */}
        {snapshot.languages.length > 0 ? (
          <Reveal>
            <div className="mt-section">
              <h3 className="label-mono text-ink-muted">Ecosystem</h3>
              <ul className="mt-8 space-y-5">
                {snapshot.languages.map((language) => (
                  <li key={language.name}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-ink-secondary">
                        {language.name}
                      </span>
                      <span
                        data-numeric
                        className="font-mono text-[0.6875rem] text-ink-faint"
                      >
                        {language.share}%
                      </span>
                    </div>
                    <div className="mt-2.5 h-px w-full bg-hairline">
                      <div
                        className="h-px bg-gradient-to-r from-cyan-soft/80 to-violet-soft/50"
                        style={{ width: `${language.share}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="border-b border-hairline py-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:px-6 md:first:pl-0">
      <dd
        data-numeric
        className="font-display text-3xl font-medium tracking-[-0.03em] text-ink"
      >
        {value === null ? "—" : value.toLocaleString()}
      </dd>
      <dt className="mt-2 label-mono">{label}</dt>
    </div>
  );
}

/**
 * Shown when the calendar could not be loaded. States the cause and the fix
 * rather than rendering a decorative empty grid that would imply a year of
 * no activity.
 */
function DataNotice({ live }: { live: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border border-dashed border-hairline-strong p-8",
      )}
    >
      <p className="label-mono">Contribution calendar unavailable</p>
      <p className="max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        {live
          ? "Repository data loaded, but the contribution calendar needs the GitHub GraphQL API, which requires authentication even for public data. Add a read-only GITHUB_TOKEN to the environment to enable it."
          : "The GitHub API did not respond, so this section is showing the project index from local content instead. Repository counts and activity are not live."}
      </p>
    </div>
  );
}
