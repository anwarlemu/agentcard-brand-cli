import assert from 'node:assert/strict';

// Scroll edges fade, never cut content off: the rail, a scroll area and a menu each fade over 24px at an edge with more
// past it, and not at all at an edge with nothing past it. The fade is tied to the scroll (theme.css, fade-y).
const read = locator => locator.evaluate(async el => {
  await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
  const style = getComputedStyle(el);
  return { mask: style.maskImage || style.webkitMaskImage, start: style.getPropertyValue('--fade-start').trim(), end: style.getPropertyValue('--fade-end').trim(), scrolls: el.scrollHeight > el.clientHeight + 1 };
});
const scrollTo = (locator, top) => locator.evaluate((el, value) => { el.scrollTop = value === 'end' ? el.scrollHeight : value; }, top);

async function expectFade(locator, label) {
  await scrollTo(locator, 0);
  let state = await read(locator);
  assert.ok(state.scrolls, `${label} scrolls`);
  assert.match(state.mask, /linear-gradient/, `${label} has the fade mask`);
  assert.equal(state.start, '0px', `${label} at rest: the first row is whole (no top fade)`);
  assert.equal(state.end, '24px', `${label} at rest: the bottom fades over 24px`);
  await scrollTo(locator, 200);
  state = await read(locator);
  assert.equal(state.start, '24px', `${label} scrolled: the top fades over 24px`);
  assert.equal(state.end, '24px', `${label} scrolled: the bottom fades over 24px`);
  await scrollTo(locator, 'end');
  state = await read(locator);
  assert.equal(state.end, '0px', `${label} at the end: no bottom fade`);
  await scrollTo(locator, 0);
}

export async function checkFade(page, base) {
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}/components/button`);
    if (width < 1024) await page.getByRole('button', { name: 'Open the library' }).click();
    await expectFade(page.locator('nav[aria-label="Library"] [data-rail-scroll]'), `Rail (${width}px)`);
  }
  await page.setViewportSize({ width: 720, height: 900 });
  await page.goto(`${base}/preview/scroll-area/Site`);
  await page.locator('[data-preview-ready]').waitFor();
  await expectFade(page.locator('[data-slot="scroll-area-viewport"]').first(), 'Scroll area');
  await page.setViewportSize({ width: 390, height: 220 });
  await page.goto(`${base}/preview/dropdown-menu/Site`);
  await page.locator('[data-preview-ready]').waitFor();
  await page.getByRole('button', { name: 'Card actions' }).click();
  const menu = page.locator('[data-slot="dropdown-menu-viewport"]').first();
  await menu.waitFor();
  const state = await read(menu);
  assert.ok(state.scrolls && /linear-gradient/.test(state.mask) && state.start === '0px' && state.end === '24px', 'A menu taller than the room scrolls inside its panel and fades at the bottom');
  await page.locator('body').press('Escape');
  // Code scrolls both ways (fade-xy): no fade at a resting edge, 24px on every edge mid-scroll.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/components/button`);
  const code = page.locator('#source pre').first();
  await code.scrollIntoViewIfNeeded();
  const edges = (top, left) => code.evaluate(async (el, [t, l]) => {
    el.scrollTop = t; el.scrollLeft = l;
    await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
    const style = getComputedStyle(el);
    return ['--fade-start', '--fade-end', '--fade-x-start', '--fade-x-end'].map(name => style.getPropertyValue(name).trim()).join(' ');
  }, [top, left]);
  assert.equal(await edges(0, 0), '0px 24px 0px 24px', 'Code at rest: whole first line and column, fades at the bottom and right');
  assert.equal(await edges(150, 200), '24px 24px 24px 24px', 'Code mid-scroll: every edge fades over 24px');
  console.log('PASS: the rail, a scroll area, a long menu and code (both axes) fade at scroll edges with more past them, never at a resting edge.');
}
