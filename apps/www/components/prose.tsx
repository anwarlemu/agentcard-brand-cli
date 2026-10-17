// Inline code as the guides set it (.v7-guide-prose code): the pale sky with a faint blue edge, 5px corners, blue text in
// the system monospace at 14px, kept whole across a line break.
export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded-sm border border-[color-mix(in_srgb,var(--ds-color-brand)_14%,transparent)] bg-sky-wash px-1.5 py-px font-code text-body-sm text-fg-brand [box-decoration-break:clone] [overflow-wrap:anywhere]">{children}</code>;
}

// Docs text from the registry's frontmatter: `backticked` names become inline code.
export function Prose({ text }: { text: string }) {
  return <>{Array.from(text.matchAll(/`([^`]+)`|([^`]+|`)/g), (match) => (match[1] !== undefined ? <InlineCode key={match.index}>{match[1]}</InlineCode> : match[0]))}</>;
}
