"use client";

import { useState } from "react";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

function Pages({ count, initial = 0 }: { count: number; initial?: number }) {
  const [page, setPage] = useState(initial);
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (p >= 0 && p < count) setPage(p);
  };
  const shown = count <= 7 ? Array.from({ length: count }, (_, i) => i) : [...new Set([0, page - 1, page, page + 1, count - 1].filter((p) => p >= 0 && p < count))].sort((a, b) => a - b);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={go(page - 1)} aria-disabled={page === 0 || undefined} tabIndex={page === 0 ? -1 : undefined} />
        </PaginationItem>
        {shown.map((p, i) => (
          <PaginationItem key={p} className="flex items-center gap-1">
            {i > 0 && p - shown[i - 1] > 1 && <PaginationEllipsis />}
            <PaginationLink href="#" isActive={p === page} onClick={go(p)} aria-label={`Page ${p + 1}`}>
              {p + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#" onClick={go(page + 1)} aria-disabled={page === count - 1 || undefined} tabIndex={page === count - 1 ? -1 : undefined} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function Site() {
  return <Pages count={5} />;
}

export function Many() {
  return <Pages count={24} initial={9} />;
}
