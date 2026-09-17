// Regression checks for the visual adversarial review. Run against a built local site.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.DESIGN_BASE_URL || 'http://127.0.0.1:4173';
const channel = process.env.BROWSER_CHANNEL || 'msedge';
const output = '.bundle/adversarial-fixed/' + channel;
(async () => {
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({channel,headless:true});
  const page = await browser.newPage();
  await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  const errors=[];
  page.on('pageerror', e=>errors.push({url:page.url(),message:e.message}));
  const layouts=[];
  for (const width of [320,390,768,959,960,1024,1440]) for (const size of [100,200]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base);
    await page.evaluate(size=>document.documentElement.style.fontSize=size+'%',size);
    const metrics=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth+1,
      titleWidth:Math.min(...Array.from(document.querySelectorAll('.list-post .title')).map(e=>e.getBoundingClientRect().width)),
      header:document.querySelector('.header').getBoundingClientRect().toJSON(),
      theme:document.querySelector('#theme-select').getBoundingClientRect().toJSON()
    }));
    assert.equal(metrics.overflow,false,JSON.stringify({width,size,metrics}));
    assert.ok(metrics.titleWidth>=240,JSON.stringify({width,size,metrics}));
    assert.ok(metrics.theme.y>=metrics.header.y && metrics.theme.bottom<=metrics.header.bottom);
    layouts.push({width,size,titleWidth:metrics.titleWidth});
    if(width===768&&size===200){
      await page.locator('.list-post .title').filter({hasText:'Clash Verge'}).scrollIntoViewIfNeeded();
      await page.screenshot({path:output+'/title-200-percent.png'});
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  // Opening the disclosure must place the links next in natural keyboard order.
  await page.locator('.menu-toggle').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#site-menu a').first().evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>{const a=Array.from(document.querySelectorAll('.categories a')).at(-1),r=a.getBoundingClientRect();scrollTo(0,r.top+scrollY+r.height/2-(innerHeight-38))});
  await page.waitForTimeout(50);
  assert.equal(await page.evaluate(()=>{const a=Array.from(document.querySelectorAll('.categories a')).at(-1),r=a.getBoundingClientRect();return a===document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)}),true,'Category link intercepted');
  assert.equal(await page.locator('.to-top').evaluate(e=>getComputedStyle(e).position),'static');
  await page.screenshot({path:output+'/category-accessible.png'});
  await page.locator('.to-top').click();
  await page.waitForFunction(()=>scrollY===0);
  assert.equal(await page.locator('#main-content').evaluate(e=>e===document.activeElement),true);
  // All Rouge token families, also nested under highlighted-line backgrounds.
  const tokens='hll c ch cd cm cp cpf c1 cs k kc kd kn kp kr kt kv ow m mb mf mh mi mo mx il s sa sb sc sd s2 se sh si sx sr s1 ss dl l ld na nb bp nc no nd ni ne nf fm nl nn nt nv vc vg vi vm py n nx o p w x g ge gs ges gh gu go gp err gr gt gd gi'.split(' ');
  await page.goto(base+'/240902-1/');
  await page.evaluate(tokens=>{
    const pre=document.createElement('pre');pre.className='highlight';pre.id='all-token-fixture';
    tokens.forEach(token=>{const span=document.createElement('span');span.className=token;span.textContent=token+' 示例 123';pre.append(span,document.createTextNode('\n'))});
    const line=document.createElement('span');line.className='hll';
    tokens.forEach(token=>{const span=document.createElement('span');span.className=token;span.textContent=token+' highlighted';line.append(span,document.createTextNode('\n'))});
    pre.appendChild(line);document.querySelector('.post').prepend(pre);
  },tokens);
  const contrasts=[];
  for (const theme of ['light','dark']) {
    await page.locator('#theme-select').selectOption(theme);
    const values=await page.locator('#all-token-fixture span').evaluateAll(elements=>{
      const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number);
      const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
      return elements.map(e=>{
        let bg;for(let p=e;p;p=p.parentElement){const c=rgb(getComputedStyle(p).backgroundColor);if(c.length===3||c[3]===1){bg=c;break}}
        const fg=rgb(getComputedStyle(e).color),a=lum(fg),b=lum(bg);
        return {token:e.className,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
      });
    });
    assert.deepEqual(values.filter(v=>v.ratio<4.5),[],theme+' syntax contrast');
    contrasts.push({theme,count:values.length,minRatio:Math.min(...values.map(v=>v.ratio))});
    await page.locator('#all-token-fixture').scrollIntoViewIfNeeded();
    await page.screenshot({path:output+'/syntax-'+theme+'.png'});
  }
  for (const width of [320,390,768,1440]) for (const theme of ['light','dark']) {
    await page.setViewportSize({width,height:900});await page.goto(base);
    await page.locator('#theme-select').selectOption(theme);
    await page.locator('.header').screenshot({path:output+`/header-${width}-${theme}.png`});
  }
  assert.equal(await page.locator('.footer #theme-select').count(),0);
  const icons=await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').evaluateAll(es=>es.map(e=>e.href));
  assert.equal(icons.length,2);assert.ok(icons.every(url=>url===base+'/static/img/wy-logo-blue.png'));
  const image=await page.request.get(icons[0]);assert.equal(image.status(),200);assert.equal((await image.body()).readUInt32BE(0),0x89504e47);
  await page.locator('#theme-select').selectOption('light');await page.emulateMedia({colorScheme:'dark'});await page.reload();
  assert.equal(await page.locator('#theme-select').inputValue(),'light');assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),false);
  await page.locator('#theme-select').selectOption('system');assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),true);
  assert.deepEqual(errors,[]);
  const result={channel,layouts,contrasts,categoryHit:'passed',returnToTop:'passed',themeHeader:'passed',themePersistence:'passed',icons:'passed',errors};
  fs.writeFileSync(output+'/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
