/* Run against a Jekyll build: DESIGN_BASE_URL=http://127.0.0.1:4173 node _tests/visual_design_test.cjs
 * Requires Playwright and installed Chrome/Edge (or set BROWSER_CHANNEL).
 * Remote media are excluded from the deterministic layout matrix, not from the site itself.
 */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.DESIGN_BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.DESIGN_OUTPUT || '.bundle/design-review';
(async () => {
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push({page:page.url(),message:e.message,stack:e.stack}));
  page.on('requestfailed',request=>{
    if (request.url().startsWith(base) && request.resourceType()==='script') console.error('SCRIPT LOAD FAILED',request.url(),request.failure());
  });
  await page.goto(base);
  const posts=await page.locator('.list-post .title a').evaluateAll(as=>as.map(a=>a.pathname));
  const paths=['/','/pages/categories.html','/pages/search.html','/pages/about.html','/pages/links.html','/pages/chat.html','/404.html',...posts];
  const currentNavigation = new Map([
    ['/','首页'],
    ['/pages/categories.html','归类'],
    ['/pages/search.html','搜索'],
    ['/pages/about.html','关于'],
    ['/pages/links.html','友链'],
    ['/pages/chat.html','留言']
  ]);
  const problems=[];
  let layouts=0;
  for(const width of [320,375,390,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:900});
    for(const theme of ['light','dark']) {
      await page.evaluate(theme=>localStorage.setItem('theme',theme),theme);
      for(const path of paths) {
        await page.goto(base+path,{waitUntil:'domcontentloaded'});
        const currentItems = await page.locator('#site-menu [aria-current="page"]').allTextContents();
        const expectedCurrent = currentNavigation.has(path) ? [currentNavigation.get(path)] : [];
        assert.deepEqual(currentItems, expectedCurrent, `Current navigation mismatch at ${path}`);
        const result=await page.evaluate(()=>({
          overflow:document.documentElement.scrollWidth > innerWidth+1,
          main:document.querySelectorAll('main').length,
          title:document.querySelectorAll('main > .page > h1, main .article-header > h1, main .page-heading > h1').length,
          theme:document.documentElement.classList.contains('dark')?'dark':'light',
          offenders:Array.from(document.querySelectorAll('main *')).filter(el=>el.getBoundingClientRect().right>innerWidth+1 && !el.closest('pre, .table-container')).slice(0,4).map(el=>el.tagName+'.'+el.className)
        }));
        if(result.overflow||result.main!==1||result.title!==1||result.theme!==theme) problems.push({width,theme,path,...result});
        layouts++;
      }
    }
  }
  assert.deepEqual(problems,[], 'Layout regressions: '+JSON.stringify(problems));
  // Manual preference persists across system changes and reloads.
  await page.goto(base);
  await page.locator('#theme-select').selectOption('light');
  await page.emulateMedia({colorScheme:'dark'});
  assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('dark')),false);
  await page.reload();
  assert.equal(await page.locator('#theme-select').inputValue(),'light');
  await page.locator('#theme-select').selectOption('system');
  assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('dark')),true);
  await page.emulateMedia({colorScheme:'light'});
  await page.waitForFunction(()=>!document.documentElement.classList.contains('dark'));
  // Mobile menu and keyboard dismissal.
  await page.setViewportSize({width:390,height:844});
  const menu=page.locator('#site-menu');
  assert.equal(await menu.isVisible(),false);
  await page.locator('.menu-toggle').click();
  assert.equal(await menu.isVisible(),true);
  await menu.locator('a').first().focus();
  await page.keyboard.press('Escape');
  assert.equal(await menu.isVisible(),false);
  assert.equal(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement),true);
  // Search success, empty results, hostile input, index failure and retry.
  await page.goto(base+'/pages/search.html');
  await page.waitForFunction(()=>document.querySelector('#search-status').textContent.includes('输入关键词'));
  await page.locator('#search-input').fill('Clash');
  await page.waitForFunction(()=>document.querySelectorAll('.list-search li:not([hidden])').length>0);
  await page.locator('#search-input').fill('no-result-very-specific-987654321');
  await page.waitForFunction(()=>document.querySelector('#search-status').textContent.includes('没有找到'));
  await page.locator('#search-input').fill('<img src=x onerror=alert(1)>');
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.list-search img').count(),0);
  await page.evaluate(()=>{localStorage.removeItem('db');localStorage.removeItem('dbVersion')});
  await page.route('**/static/xml/search.xml*',route=>route.fulfill({status:503,body:'unavailable'}));
  await page.reload();
  await page.waitForFunction(()=>document.querySelector('#search-status').textContent.includes('失败'));
  await page.locator('#search-input').fill('Clash');
  await page.waitForFunction(()=>document.querySelectorAll('.list-search li:not([hidden])').length>0);
  await page.unroute('**/static/xml/search.xml*');
  await page.locator('.search-retry').click();
  await page.waitForFunction(()=>document.querySelector('#search-status').textContent.includes('找到')&&!document.querySelector('#search-status').textContent.includes('失败'));
  // Preview opens by keyboard, traps focus, closes via Escape and restores focus.
  await page.goto(base+posts[0]);
  const img=page.locator('.post img[role="button"]').first();
  await img.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('dialog').evaluate(el=>el.contains(document.activeElement)),true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('dialog').open);
  assert.equal(await img.evaluate(el=>el===document.activeElement),true);
  // Reduced motion and 200% text-size reflow.
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior),'auto');
  await page.goto(base);
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.reload();
  // Capture representative screens.
  const screens=[['home','/'],['article',posts[0]],['code','/240902-1/'],['search','/pages/search.html']];
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:width===390?844:1000});
    for(const theme of ['light','dark']) {
      await page.evaluate(theme=>localStorage.setItem('theme',theme),theme);
      for(const [name,path] of screens) {
        await page.goto(base+path,{waitUntil:'domcontentloaded'});
        if(name==='search') { await page.locator('#search-input').fill('Clash');await page.waitForTimeout(200); }
        await page.screenshot({path:`${output}/${name}-${width}-${theme}.png`});
      }
    }
  }
  assert.deepEqual(errors,[]);
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:720}});
  const nojsPage=await nojs.newPage();
  await nojsPage.goto(base);
  assert.equal(await nojsPage.locator('#site-menu').isVisible(),true);
  await nojs.close();
  const summary={channel:process.env.BROWSER_CHANNEL||'msedge',layouts,pages:paths.length,widths:[320,375,390,768,1024,1440,1920],themes:['light','dark'],errors,interactions:'passed',remoteMedia:'excluded from deterministic layout matrix'};
  fs.writeFileSync(`${output}/results-${summary.channel}.json`,JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
