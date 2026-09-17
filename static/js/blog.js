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

/**
 * 工具，兼容的方式添加事件
 * @param {单个DOM节点} dom
 * @param {事件名} eventName
 * @param {事件方法} func
 * @param {是否捕获} useCapture
 */
blog.addEvent = function (dom, eventName, func, useCapture) {
  if (window.attachEvent) {
    dom.attachEvent('on' + eventName, func)
  } else if (window.addEventListener) {
    if (useCapture != undefined && useCapture === true) {
      dom.addEventListener(eventName, func, true)
    } else {
      dom.addEventListener(eventName, func, false)
    }
  }
}

/**
 * 工具，DOM添加某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.addClass = function (dom, className) {
  if (!blog.hasClass(dom, className)) {
    var c = dom.className || ''
    dom.className = c + ' ' + className
    dom.className = blog.trim(dom.className)
  }
}

/**
 * 工具，DOM是否有某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.hasClass = function (dom, className) {
  var list = (dom.className || '').split(/\s+/)
  for (var i = 0; i < list.length; i++) {
    if (list[i] == className) return true
  }
  return false
}

/**
 * 工具，DOM删除某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.removeClass = function (dom, className) {
  if (blog.hasClass(dom, className)) {
    var list = (dom.className || '').split(/\s+/)
    var newName = ''
    for (var i = 0; i < list.length; i++) {
      if (list[i] != className) newName = newName + ' ' + list[i]
    }
    dom.className = blog.trim(newName)
  }
}

/**
 * 工具，兼容问题，某些OPPO手机不支持ES5的trim方法
 * @param {字符串} str
 */
blog.trim = function (str) {
  return str.replace(/^\s+|\s+$/g, '')
}

/**
 * 工具，转义html字符
 * @param {字符串} str
 */
blog.htmlEscape = function (str) {
  var temp = document.createElement('div')
  temp.innerText = str
  str = temp.innerHTML
  temp = null
  return str
}

/**
 * 工具，转换实体字符防止XSS
 * @param {字符串} str
 */
blog.encodeHtml = function (html) {
  var o = document.createElement('div')
  o.innerText = html
  var temp = o.innerHTML
  o = null
  return temp
}

/**
 * 工具， 转义正则关键字
 * @param {字符串} str
 */
blog.encodeRegChar = function (str) {
  // \ 必须在第一位
  var arr = ['\\', '.', '^', '$', '*', '+', '?', '{', '}', '[', ']', '|', '(', ')']
  arr.forEach(function (c) {
    var r = new RegExp('\\' + c, 'g')
    str = str.replace(r, '\\' + c)
  })
  return str
}

/**
 * 工具，Ajax
 * @param {字符串} str
 */
blog.ajax = function (option, success, fail) {
  var xmlHttp = null
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest()
  } else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  var url = option.url
  var method = (option.method || 'GET').toUpperCase()
  var sync = option.sync === false ? false : true
  var timeout = option.timeout || 10000

  var timer
  var isTimeout = false
  xmlHttp.open(method, url, sync)
  xmlHttp.onreadystatechange = function () {
    if (isTimeout) {
      fail({
        error: '请求超时'
      })
    } else {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          success(xmlHttp.responseText)
        } else {
          fail({
            error: '状态错误',
            code: xmlHttp.status
          })
        }
        //清除未执行的定时函数
        clearTimeout(timer)
      }
    }
  }
  timer = setTimeout(function () {
    isTimeout = true
    fail({
      error: '请求超时'
    })
    xmlHttp.abort()
  }, timeout)
  xmlHttp.send()
}

/**
 * 特效：点击页面文字冒出特效
 */
blog.initClickEffect = function (textArr) {
  function createDOM(text) {
    var dom = document.createElement('span')
    dom.innerText = text
    dom.style.left = 0
    dom.style.top = 0
    dom.style.position = 'fixed'
    dom.style.fontSize = '12px'
    dom.style.whiteSpace = 'nowrap'
    dom.style.webkitUserSelect = 'none'
    dom.style.userSelect = 'none'
    dom.style.opacity = 0
    dom.style.transform = 'translateY(0)'
    dom.style.webkitTransform = 'translateY(0)'
    return dom
  }

  blog.addEvent(window, 'click', function (ev) {
    let target = ev.target
    while (target !== document.documentElement) {
      if (target.tagName.toLocaleLowerCase() == 'a') return
      if (blog.hasClass(target, 'footer-btn')) return
      target = target.parentNode
    }

    var text = textArr[parseInt(Math.random() * textArr.length)]
    var dom = createDOM(text)

    document.body.appendChild(dom)
    var w = parseInt(window.getComputedStyle(dom, null).getPropertyValue('width'))
    var h = parseInt(window.getComputedStyle(dom, null).getPropertyValue('height'))

    var sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    dom.style.left = ev.pageX - w / 2 + 'px'
    dom.style.top = ev.pageY - sh - h + 'px'
    dom.style.opacity = 1

    setTimeout(function () {
      dom.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out'
      dom.style.webkitTransition = 'transform 500ms ease-out, opacity 500ms ease-out'
      dom.style.opacity = 0
      dom.style.transform = 'translateY(-26px)'
      dom.style.webkitTransform = 'translateY(-26px)'
    }, 20)

    setTimeout(function () {
      document.body.removeChild(dom)
      dom = null
    }, 520)
  })
}

// Navigation remains available without JavaScript; collapse only after binding.
blog.addLoadEvent(function () {
  const button = document.querySelector('.menu-toggle')
  const menu = document.querySelector('.menu')
  if (button && menu) {
    function closeMenu() { menu.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false') }
    button.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open')
      button.setAttribute('aria-expanded', String(open))
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

  const select = document.getElementById('theme-select')
  if (select) {
    select.value = blog.theme
    select.parentElement.hidden = false
    select.addEventListener('change', function () {
      blog.theme = select.value
      try { localStorage.setItem('theme', blog.theme) } catch (e) {}
      blog.applyTheme()
    })
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (blog.theme === 'system') blog.applyTheme()
    })
    window.addEventListener('storage', function (event) {
      if (event.key !== 'theme') return
      blog.theme = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'system'
      select.value = blog.theme
      blog.applyTheme()
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
    img.decoding = 'async'
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
