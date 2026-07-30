import "server-only";

import type {
  ContributionCalendar,
  ContributionDay,
  GitHubSnapshot,
  LanguageShare,
  Repo,
} from "@/types";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

/**
 * GitHub data.
 *
 * Fetched on the server, cached, and — critically — never allowed to break
 * the page. Every path through this module returns a valid `GitHubSnapshot`,
 * so a rate limit, an outage, a renamed account, or a missing token degrades
 * the section rather than the site.
 *
 * The `live` flag is what the UI keys off. When it is false the section says
 * so plainly instead of showing plausible-looking numbers, because inventing
 * contribution statistics on a portfolio is a lie with a very short fuse.
 *
 * Contribution calendars are only available through the GraphQL API, which
 * requires authentication even for public data. Set `GITHUB_TOKEN` to a
 * read-only fine-grained PAT with no scopes beyond public repository read.
 */

const REVALIDATE_SECONDS = 3600;
const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query Contributions($login: String!) {
    user(login: $login) {
      followers { totalCount }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const LEVEL_MAP: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

interface RestRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchRepos(login: string): Promise<Repo[] | null> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${login}/repos?sort=pushed&per_page=100`,
      { headers: authHeaders(), next: { revalidate: REVALIDATE_SECONDS } },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as RestRepo[];
    if (!Array.isArray(data)) return null;

    return data
      /* Forks and archives are noise on a showcase — they say nothing about
         what someone is currently building. */
      .filter((repo) => !repo.fork && !repo.archived)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.pushed_at,
        topics: repo.topics ?? [],
      }));
  } catch {
    return null;
  }
}

async function fetchContributions(
  login: string,
): Promise<{ calendar: ContributionCalendar; followers: number } | null> {
  if (!process.env.GITHUB_TOKEN) return null;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;

    const json = await response.json();
    const user = json?.data?.user;
    const raw = user?.contributionsCollection?.contributionCalendar;
    if (!raw) return null;

    const weeks: ContributionDay[][] = raw.weeks.map(
      (week: {
        contributionDays: {
          date: string;
          contributionCount: number;
          contributionLevel: string;
        }[];
      }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: LEVEL_MAP[day.contributionLevel] ?? 0,
        })),
    );

    return {
      calendar: { total: raw.totalContributions, weeks },
      followers: user?.followers?.totalCount ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Language mix, derived from each repository's primary language.
 *
 * Deliberately not the per-repository `languages` endpoint: that would be one
 * request per repo, and it weights by bytes — which reliably concludes that
 * anyone with a lockfile or a vendored CSS file is primarily a JSON author.
 */
function deriveLanguages(repos: Repo[]): LanguageShare[] {
  const counts = new Map<string, number>();

  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      share: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 6);
}

/**
 * The offline snapshot.
 *
 * Built from the case studies already in `src/content`, so it shows real
 * work rather than invented activity. Counts are zero and `live` is false —
 * the section renders an explicit notice in this state.
 */
function fallbackSnapshot(login: string): GitHubSnapshot {
  const repos: Repo[] = projects.map((project) => ({
    name: project.slug,
    description: project.tagline,
    /* The project's real repository URL, never a guess assembled from the
       slug — a fallback that renders dead links is worse than no fallback. */
    url: project.links?.repo ?? profile.githubUrl,
    language: "TypeScript",
    stars: 0,
    forks: 0,
    updatedAt: `${project.year}-01-01T00:00:00Z`,
    topics: project.stack.slice(0, 3).map((s) => s.toLowerCase()),
  }));

  return {
    login,
    repos,
    calendar: null,
    languages: [],
    totals: { repos: repos.length, stars: 0, followers: 0 },
    live: false,
  };
}

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  const login = profile.githubUser;

  const [repos, contributions] = await Promise.all([
    fetchRepos(login),
    fetchContributions(login),
  ]);

  if (!repos) return fallbackSnapshot(login);

  const ranked = [...repos].sort(
    (a, b) =>
      b.stars - a.stars ||
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return {
    login,
    repos: ranked,
    calendar: contributions?.calendar ?? null,
    languages: deriveLanguages(repos),
    totals: {
      repos: repos.length,
      stars: repos.reduce((sum, r) => sum + r.stars, 0),
      followers: contributions?.followers ?? 0,
    },
    live: true,
  };
}
