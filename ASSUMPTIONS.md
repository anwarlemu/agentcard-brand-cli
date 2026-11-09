# Assumptions for the brand owner to confirm

Each is in force today; each names where it lives, so a change is one edit.

1. Source. Values were measured from the rendered https://www.agentcard.sh on 2026-10-17 (computed styles), with the
   agentcard-website source (main at 5b5c801) for names and structure. The live site is ahead of that branch (its
   blue is #0000FF; the branch has #1520B8 and #2E3AE8). `brand/tokens.css`, `brand/elements.json`.
2. Agentcard has a site only: every project, including an app or dashboard, gets the site's look. `brand/brand.json`
   (`surfaces`).
3. The display face is Neue Haas Grotesk Display, named in the stack and not shipped (it needs a webfont licence), so
   it renders as Helvetica Neue on Apple devices and Helvetica or Arial elsewhere, as on agentcard.sh. Only Inter is
   loaded. `brand/tokens.css` (`--ds-font-display`), `brand/brand.json` (`fonts`).
4. The one markup touch on a restyled site is `data-ds-hero` on the home hero: the blue ground, white type and the four
   stepped bands into the page below. Nothing else gets the blue ground automatically. `brand/site.css`,
   `brand/brand.json` (`touches`).
5. Section headings are centered with their description below, as on agentcard.sh's home. `brand/elements.json`.
6. Muted text tokens are solid colors composited on white (ink at 80, 68, 60 and 45 percent), so they read the same on
   any white and pass AA; on the blue ground, text uses white at 72 percent. `brand/tokens.css`.
7. Small tags are the one place type is set in caps, so the value check allows uppercase. `brand/brand.json` (`type`).
8. Fields are square (no corners), as on agentcard.sh's forms. `brand/elements.json` (input).
9. Code is set in the display face, as on agentcard.sh's code windows. `brand/tokens.css` (`--ds-font-mono`).
10. The logo is the lockup supplied on 2026-10-17 (`brand/logo/lockup.svg`, `brand/logo/mark.svg`). Compared on
    2026-11-09 with the hand at https://agentcard.com/landing/home/agentcard-logo.svg: both are that hand, drawn as
    horizontal lines. The live file uses a different viewBox and a white fill. Images use the files in `brand/logo`.
11. Review passes at 7 on every score. `brand/brand.json`.
12. The repo is public, so installs need no token. Make it private if the brand's files should not be public.
13. `image render` sets text in Inter, the only face the CLI ships. The display face stays the named stack and is not
    included. Quotes use Inter's round quote alternates, because the default quote glyphs are square slabs. Sizes are
    Open Graph 1200 by 630, square 1080 by 1080, portrait 1080 by 1350 and landscape 1200 by 675.
    The earlier social and Open Graph tools in agd-playground were not readable from this environment, so the templates
    follow the site: blue ground, paper, the lockup, the window and the stepped band.
