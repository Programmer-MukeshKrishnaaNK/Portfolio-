import type { ArchDiagram as ArchDiagramData, ArchNode, ArchNodeKind } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Architecture diagrams, drawn from data.
 *
 * Hand-drawn SVG or an exported image would both be dead weight: they go
 * stale the moment the architecture changes, and neither is legible to a
 * screen reader. These are generated from the `nodes` and `edges` in the
 * project's content file, so the diagram and the prose cannot disagree, and
 * the whole thing is described in text underneath for anyone who is not
 * looking at it.
 *
 * Routing is orthogonal rather than curved — a right-angle lattice reads as
 * a technical drawing, which is the register the rest of the page is in.
 */

const NODE_W = 200;
const NODE_H = 66;
const COL_GAP = 64;
const ROW_GAP = 46;
const PAD = 16;

/** Monospace detail line: 8.5px glyphs are ~5.1px wide inside a 172px box. */
const DETAIL_FONT = 8.5;
const DETAIL_MAX_CHARS = 32;

/**
 * Backward edges run in channels under the lattice so they never cross a node.
 * Each one gets its own lane — sharing a lane makes two separate connections
 * render as a single continuous line, which is worse than not drawing them.
 */
const CHANNEL_GAP = 26;
const CHANNEL_LANE = 15;

const KIND_STYLE: Record<
  ArchNodeKind,
  { stroke: string; label: string; accent: string }
> = {
  client: { stroke: "rgb(255 255 255 / 0.20)", label: "Client", accent: "#ffffff" },
  route: { stroke: "rgb(110 231 240 / 0.42)", label: "Route", accent: "#6ee7f0" },
  service: { stroke: "rgb(255 255 255 / 0.14)", label: "Service", accent: "#b4b4bd" },
  model: { stroke: "rgb(167 139 250 / 0.48)", label: "Model", accent: "#a78bfa" },
  store: { stroke: "rgb(255 255 255 / 0.14)", label: "Store", accent: "#8f8f99" },
  external: { stroke: "rgb(255 255 255 / 0.12)", label: "External", accent: "#8f8f99" },
};

const nodeX = (node: ArchNode) => node.col * (NODE_W + COL_GAP);
const nodeY = (node: ArchNode) => node.row * (NODE_H + ROW_GAP);

export function ArchDiagram({ diagram }: { diagram: ArchDiagramData }) {
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));

  const maxCol = Math.max(...diagram.nodes.map((n) => n.col));
  const maxRow = Math.max(...diagram.nodes.map((n) => n.row));

  const width = (maxCol + 1) * NODE_W + maxCol * COL_GAP;
  const latticeHeight = (maxRow + 1) * NODE_H + maxRow * ROW_GAP;

  /* Assign each backward edge its own return lane, in declaration order. */
  const laneOf = new Map<number, number>();
  diagram.edges.forEach((edge, i) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (from && to && to.col < from.col) laneOf.set(i, laneOf.size);
  });

  const baseChannelY = latticeHeight + CHANNEL_GAP;
  const height = baseChannelY + Math.max(laneOf.size, 1) * CHANNEL_LANE;

  return (
    <figure>
      {/* Horizontal scroll rather than shrink-to-fit: a diagram scaled down to
          375px is unreadable, and an unreadable diagram is worse than one that
          asks to be scrolled. */}
      <div className="-mx-gutter overflow-x-auto px-gutter pb-4">
        <svg
          viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
          width={width + PAD * 2}
          role="img"
          aria-label={`${diagram.title}. ${describe(diagram)}`}
          className="h-auto max-w-none"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,1 L7,4 L0,7 z" fill="rgb(255 255 255 / 0.34)" />
            </marker>
          </defs>

          {diagram.edges.map((edge, i) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;

            const { path, labelAt } = routeEdge(
              from,
              to,
              baseChannelY + (laneOf.get(i) ?? 0) * CHANNEL_LANE,
            );

            return (
              <g key={`${edge.from}-${edge.to}-${i}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={
                    edge.stream ? "rgb(110 231 240 / 0.5)" : "rgb(255 255 255 / 0.16)"
                  }
                  strokeWidth={1}
                  markerEnd="url(#arrow)"
                  className={edge.stream ? "arch-stream" : undefined}
                />
                {edge.label ? (
                  <>
                    {/* Knocks the line out behind the label so the two never
                        overlap into an unreadable smudge. */}
                    <rect
                      x={labelAt.x - edge.label.length * 3.1 - 5}
                      y={labelAt.y - 8}
                      width={edge.label.length * 6.2 + 10}
                      height={15}
                      rx={2}
                      fill="#050505"
                    />
                    <text
                      x={labelAt.x}
                      y={labelAt.y + 3}
                      textAnchor="middle"
                      className="fill-[#7c7c86] font-mono"
                      style={{ fontSize: 9, letterSpacing: "0.08em" }}
                    >
                      {edge.label}
                    </text>
                  </>
                ) : null}
              </g>
            );
          })}

          {diagram.nodes.map((node) => {
            const style = KIND_STYLE[node.kind];
            const x = nodeX(node);
            const y = nodeY(node);

            return (
              <g key={node.id}>
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={3}
                  fill="#0e0e10"
                  stroke={style.stroke}
                  strokeWidth={1}
                />
                <rect x={x} y={y} width={2} height={NODE_H} fill={style.accent} opacity={0.5} />
                <text
                  x={x + 14}
                  y={y + 25}
                  className="fill-white"
                  style={{ fontSize: 12.5, letterSpacing: "-0.01em" }}
                >
                  {node.label}
                </text>
                <text
                  x={x + 14}
                  y={y + 45}
                  className="fill-[#7c7c86] font-mono"
                  style={{ fontSize: DETAIL_FONT, letterSpacing: "0.03em" }}
                >
                  {truncate(node.detail, DETAIL_MAX_CHARS)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        {diagram.caption}
      </figcaption>

      <Legend kinds={[...new Set(diagram.nodes.map((n) => n.kind))]} />
    </figure>
  );
}

function Legend({ kinds }: { kinds: ArchNodeKind[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {kinds.map((kind) => (
        <li key={kind} className="flex items-center gap-2">
          <span
            aria-hidden
            className="block h-3 w-0.5 rounded-full"
            style={{ background: KIND_STYLE[kind].accent, opacity: 0.6 }}
          />
          <span className={cn("label-mono")}>{KIND_STYLE[kind].label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Orthogonal routing.
 *
 * Three cases, in the order they matter:
 *  - forward  — exit right, jog vertically halfway across the gap, enter left
 *  - same column — straight vertical between the two boxes
 *  - backward — drop into the channel below the lattice, run horizontally,
 *               then climb into the target's underside
 */
function routeEdge(from: ArchNode, to: ArchNode, channelY: number) {
  const fx = nodeX(from);
  const fy = nodeY(from);
  const tx = nodeX(to);
  const ty = nodeY(to);

  if (to.col > from.col) {
    const x1 = fx + NODE_W;
    const y1 = fy + NODE_H / 2;
    const x2 = tx;
    const y2 = ty + NODE_H / 2;
    const midX = x1 + (x2 - x1) / 2;
    return {
      path: `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`,
      labelAt: { x: midX, y: Math.min(y1, y2) + Math.abs(y2 - y1) / 2 - 6 },
    };
  }

  if (to.col === from.col) {
    const x1 = fx + NODE_W / 2;
    const goingDown = ty > fy;
    const y1 = goingDown ? fy + NODE_H : fy;
    const y2 = goingDown ? ty : ty + NODE_H;
    return {
      path: `M ${x1} ${y1} V ${y2}`,
      labelAt: { x: x1, y: (y1 + y2) / 2 },
    };
  }

  const x1 = fx + NODE_W / 2;
  const y1 = fy + NODE_H;
  const x2 = tx + NODE_W / 2;
  const y2 = ty + NODE_H;
  return {
    path: `M ${x1} ${y1} V ${channelY} H ${x2} V ${y2}`,
    labelAt: { x: (x1 + x2) / 2, y: channelY - 6 },
  };
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** Text description used as the SVG's accessible name. */
function describe(diagram: ArchDiagramData) {
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const flows = diagram.edges
    .map((e) => {
      const a = byId.get(e.from)?.label;
      const b = byId.get(e.to)?.label;
      if (!a || !b) return null;
      return `${a} to ${b}${e.label ? ` (${e.label})` : ""}`;
    })
    .filter(Boolean)
    .join("; ");
  return `Flow: ${flows}.`;
}
