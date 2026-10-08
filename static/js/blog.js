// 打印主题标识,请保留出处
;(function () {
  var style1 = 'background:#4BB596;color:#ffffff;border-radius: 2px;'
  var style2 = 'color:auto;'
  var author = ' Will Yang'
  var github = ' https://github.com/zongzaimang/zongzaimang'
  var build = ' ' + blog.buildAt.substr(0, 4)
  build += '/' + blog.buildAt.substr(4, 2)
  build += '/' + blog.buildAt.substr(6, 2)
  build += ' ' + blog.buildAt.substr(8, 2)
  build += ':' + blog.buildAt.substr(10, 2)
  console.info('%c Author %c' + author, style1, style2)
  console.info('%c Build  %c' + build, style1, style2)
  console.info('%c GitHub %c' + github, style1, style2)
})()

/**
 * 工具，允许多次onload不被覆盖
 * @param {方法} func
 */
blog.addLoadEvent = function (func) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', func, { once: true })
  else func()
}

// Navigation remains available without JavaScript; collapse only after binding.
blog.addLoadEvent(function () {
  const button = document.querySelector('.menu-toggle')
  const menu = document.querySelector('.menu')
  if (button && menu) {
    function closeMenu() { menu.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label', '打开导航菜单') }
    button.addEventListener('click', function (event) {
      const open = menu.classList.toggle('is-open')
      button.setAttribute('aria-expanded', String(open))
      button.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单')
      if (open && event.detail === 0) menu.querySelector('a').focus()
    })
    menu.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeMenu(); button.focus() }
    })
    const mobile = window.matchMedia('(max-width: 959px)')
    mobile.addEventListener('change', function () {
      if (mobile.matches && menu.contains(document.activeElement)) button.focus()
      closeMenu()
    })
    document.documentElement.classList.add('js')
  }

  const themeButton = document.querySelector('.theme-toggle')
  if (themeButton) {
    function syncThemeButton() {
      const dark = document.documentElement.classList.contains('dark')
      themeButton.dataset.theme = dark ? 'dark' : 'light'
      themeButton.setAttribute('aria-pressed', String(dark))
      themeButton.setAttribute('aria-label', dark ? '切换为浅色模式' : '切换为深色模式')
      themeButton.title = dark ? '切换为浅色模式' : '切换为深色模式'
    }
    syncThemeButton()
    themeButton.hidden = false
    themeButton.addEventListener('click', function () {
      blog.theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
      try { localStorage.setItem('theme', blog.theme) } catch (e) {}
      blog.applyTheme()
      syncThemeButton()
    })
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (blog.theme === 'system') { blog.applyTheme(); syncThemeButton() }
    })
    window.addEventListener('storage', function (event) {
      if (event.key !== 'theme') return
      blog.theme = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'system'
      blog.applyTheme()
      syncThemeButton()
    })
  }
  const topButton = document.querySelector('.to-top')
  if (topButton) {
    topButton.addEventListener('click', function (event) {
      event.preventDefault()
      document.getElementById('main-content').focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    })
  }
})

blog.addLoadEvent(function () {
  const post = document.querySelector('.post')
  if (!post) return
  post.querySelectorAll('table').forEach(function (table) {
    if (table.closest('.table-container')) return
    const wrapper = document.createElement('div')
    wrapper.className = 'table-container'
    wrapper.tabIndex = 0
    wrapper.setAttribute('role', 'region')
    wrapper.setAttribute('aria-label', '文章表格，可横向滚动')
    table.before(wrapper)
    wrapper.appendChild(table)
  })
  post.querySelectorAll('pre').forEach(function (pre) {
    pre.tabIndex = 0
    pre.setAttribute('aria-label', '代码块，可横向滚动')
  })
  const headings = Array.from(post.querySelectorAll('h1, h2, h3'))
  const toc = document.querySelector('.toc')
  if (headings.length >= 3 && toc) {
    const list = toc.querySelector('ol')
    headings.forEach(function (heading, index) {
      if (!heading.id) {
        let id = 'section-' + (index + 1)
        while (document.getElementById(id)) id += '-section'
        heading.id = id
      }
      const item = document.createElement('li')
      const link = document.createElement('a')
      link.href = '#' + encodeURIComponent(heading.id)
      link.textContent = heading.textContent
      if (heading.tagName === 'H3') link.className = 'toc-sub'
      item.appendChild(link)
      list.appendChild(item)
    })
    toc.hidden = false
    document.querySelector('.article-layout').classList.add('has-toc')
    const desktop = window.matchMedia('(min-width: 1200px)')
    const syncToc = function () { toc.querySelector('details').open = desktop.matches }
    desktop.addEventListener('change', syncToc)
    syncToc()
    const links = Array.from(list.querySelectorAll('a'))
    let scheduled = false
    function highlight() {
      let active = 0
      headings.forEach(function (h, i) { if (h.getBoundingClientRect().top <= 140) active = i })
      links.forEach(function (link, i) {
        if (i === active) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
      scheduled = false
    }
    window.addEventListener('scroll', function () {
      if (!scheduled) { scheduled = true; requestAnimationFrame(highlight) }
    }, { passive: true })
    highlight()
  }

  // Native dialog provides Escape, modal focus containment and focus restoration.
  if (typeof HTMLDialogElement === 'undefined') return
  const dialog = document.createElement('dialog')
  dialog.className = 'image-dialog'
  dialog.setAttribute('aria-label', '图片预览')
  dialog.innerHTML = '<div class="image-dialog-tools"><button type="button" class="image-expand" aria-pressed="false">展开长图</button><button type="button" class="image-close" autofocus>关闭 ×</button></div><img alt=""><p class="image-caption"></p>'
  document.body.appendChild(dialog)
  const preview = dialog.querySelector('img')
  const expand = dialog.querySelector('.image-expand')
  let source = null
  let previousOverflow = ''
  dialog.querySelector('.image-close').addEventListener('click', function () { dialog.close() })
  dialog.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return
    const controls = Array.from(dialog.querySelectorAll('button'))
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  })
  expand.addEventListener('click', function () {
    const expanded = dialog.classList.toggle('is-expanded')
    expand.setAttribute('aria-pressed', String(expanded))
    expand.textContent = expanded ? '适应窗口' : '展开长图'
  })
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return
    const bounds = dialog.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close()
  })
  dialog.addEventListener('close', function () {
    document.body.style.overflow = previousOverflow
    if (source) source.focus({ preventScroll: true })
  })
  post.querySelectorAll('img').forEach(function (img) {
    if (!img.hasAttribute('decoding')) img.decoding = 'async'
    if (img.closest('a') || img.alt === 'line') return
    img.tabIndex = 0
    img.setAttribute('role', 'button')
    img.setAttribute('aria-label', '放大图片' + (img.alt ? '：' + img.alt : ''))
    function open() {
      source = img
      preview.src = img.currentSrc || img.src
      preview.alt = img.alt
      dialog.querySelector('.image-caption').textContent = img.alt
      dialog.classList.remove('is-expanded')
      expand.setAttribute('aria-pressed', 'false')
      expand.textContent = '展开长图'
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      dialog.showModal()
      dialog.scrollTop = 0
    }
    img.addEventListener('click', open)
    img.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open() }
    })
  })
})
