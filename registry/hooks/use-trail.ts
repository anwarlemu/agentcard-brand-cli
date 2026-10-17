"use client";

import { type RefObject, useLayoutEffect } from "react";

// The brand's trail (agentcard.sh, product-trail.tsx): cards hung at their own heights and tilts with one thin line
// threaded through their centres. Cards laid out in rows are strung on one thread that snakes through them: along the
// first row, down at its end to the end of the next, back along that row, and so on. The tilts and drops are drawn by
// the component (each card's rest); this hook draws the line, a Catmull-Rom spline through the cards' true centres, and
// redraws it whenever the layout changes. Nothing here moves on its own, so there is nothing to still for reduced motion.

type Point = { x: number; y: number };

/** Where each card rests, cycling: how far down (px) and how far tilted (deg), as on the brand's page. */
export const TRAIL_REST = [
  { y: 22, rot: -2.4 },
  { y: -34, rot: 1.6 },
  { y: 8, rot: -1.8 },
] as const;

function centres(root: HTMLElement, cards: HTMLElement[]): Point[] {
  const r = root.getBoundingClientRect();
  const scale = root.offsetWidth ? r.width / root.offsetWidth : 1;
  return cards.map((card) => {
    const b = card.getBoundingClientRect();
    return { x: (b.left - r.left + b.width / 2) / scale, y: (b.top - r.top + b.height / 2) / scale };
  });
}

// Rows by where the grid puts each card (offsetTop ignores transforms), so a tilted card stays on its own row.
function rowsOf(cards: HTMLElement[]): number[][] {
  const rows: number[][] = [[0]];
  const half = cards[0].offsetHeight / 2;
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].offsetTop - cards[i - 1].offsetTop > half) rows.push([i]);
    else rows[rows.length - 1].push(i);
  }
  return rows;
}

function linePath(points: Point[], rows: number[][]): string {
  let d = "";
  let prevEnd = points[0];
  rows.forEach((line, r) => {
    const row = (r % 2 ? [...line].reverse() : line).map((i) => points[i]);
    if (!d) d = `M ${row[0].x} ${row[0].y}`;
    else {
      // The drop from the last row's end to this row's start, leaving and arriving straight down.
      const [a, b] = [prevEnd, row[0]];
      const dy = (b.y - a.y) / 2;
      d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
    }
    prevEnd = row[row.length - 1];
    for (let i = 0; i < row.length - 1; i++) {
      const p0 = row[i - 1] ?? row[i];
      const p1 = row[i];
      const p2 = row[i + 1];
      const p3 = row[i + 2] ?? p2;
      d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
    }
  });
  return d;
}

/**
 * Draws the trail's line into `pathRef` through every `[data-trail-card]` inside `rootRef`, and keeps it there as the
 * layout changes. A list whose cards stack into one column (a phone) still gets its line, straight down through them;
 * hide the svg where the component wants no line. Pass `version` (the cards' count, say) to redraw when they change.
 */
export function useTrail(rootRef: RefObject<HTMLElement | null>, pathRef: RefObject<SVGPathElement | null>, version?: unknown) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;
    const svg = path.ownerSVGElement;
    let frame = 0;
    const draw = () => {
      frame = 0;
      const cards = [...root.querySelectorAll<HTMLElement>("[data-trail-card]")];
      if (cards.length < 2) {
        path.setAttribute("d", "");
        return;
      }
      svg?.setAttribute("viewBox", `0 0 ${root.clientWidth} ${root.clientHeight}`);
      path.setAttribute("d", linePath(centres(root, cards), rowsOf(cards)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    draw();
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    for (const card of root.querySelectorAll<HTMLElement>("[data-trail-card]")) observer.observe(card);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [rootRef, pathRef, version]);
}
