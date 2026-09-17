// A failed index still leaves title search available. Content is always rendered as text.
blog.addLoadEvent(function () {
  const input = document.getElementById('search-input')
  if (!input) return
  const status = document.getElementById('search-status')
  const retry = document.querySelector('.search-retry')
  const rows = Array.from(document.querySelectorAll('.list-search li'))
  const titles = rows.map(function (row) { return row.querySelector('.title').textContent })
  let contents = []
  let state = 'loading'
  let composing = false
  let timer

  function marked(element, text, key) {
    element.textContent = ''
    const index = text.toLocaleLowerCase().indexOf(key.toLocaleLowerCase())
    if (index < 0 || !key) { element.textContent = text; return }
    element.appendChild(document.createTextNode(text.slice(0, index)))
    const mark = document.createElement('mark')
    mark.textContent = text.slice(index, index + key.length)
    element.appendChild(mark)
    element.appendChild(document.createTextNode(text.slice(index + key.length)))
  }
  function search() {
    const key = input.value.trim()
    const needle = key.toLocaleLowerCase()
    let count = 0
    rows.forEach(function (row, index) {
      const content = contents[index] || ''
      const contentIndex = content.toLocaleLowerCase().indexOf(needle)
      const match = key && (titles[index].toLocaleLowerCase().includes(needle) || contentIndex >= 0)
      row.hidden = !match
      if (!match) return
      count++
      marked(row.querySelector('.title'), titles[index], key)
      const start = Math.max(0, contentIndex - 30)
      const excerpt = (start ? '…' : '') + content.slice(start, start + Math.max(130, key.length + 40)) + (content.length > start + Math.max(130, key.length + 40) ? '…' : '')
      marked(row.querySelector('.content'), excerpt, key)
    })
    const result = key ? (count ? '找到 ' + count + ' 篇相关文章。' : '没有找到相关文章，试试更短的关键词。') : '输入关键词，搜索标题与正文。'
    status.textContent = state === 'loading' ? '正在加载全文索引，当前可搜索标题。' : state === 'error' ? '全文索引加载失败，当前仅搜索标题。' + (key ? result : '') : result
  }
  async function load() {
    state = 'loading'
    retry.hidden = true
    search()
    const controller = new AbortController()
    const timeout = setTimeout(function () { controller.abort() }, 20000)
    try {
      let data
      try {
        if (localStorage.getItem('dbVersion') === blog.buildAt) data = localStorage.getItem('db')
      } catch (e) {}
      if (!data) {
        const response = await fetch(blog.baseurl + '/static/xml/search.xml?t=' + blog.buildAt, { signal: controller.signal })
        if (!response.ok) throw new Error('Search index unavailable')
        data = await response.text()
      }
      const root = new DOMParser().parseFromString(data, 'text/html')
      const entries = Array.from(root.querySelectorAll('li'))
      if (entries.length !== rows.length) throw new Error('Search index does not match the page')
      contents = entries.map(function (entry) { return entry.textContent })
      try { localStorage.setItem('db', data); localStorage.setItem('dbVersion', blog.buildAt) } catch (e) {}
      state = 'ready'
    } catch (e) {
      state = 'error'
      retry.hidden = false
      try { localStorage.removeItem('dbVersion'); localStorage.removeItem('db') } catch (error) {}
    } finally { clearTimeout(timeout); search() }
  }
  input.addEventListener('input', function () {
    clearTimeout(timer)
    if (!composing) timer = setTimeout(search, 120)
  })
  input.addEventListener('compositionstart', function () { composing = true; clearTimeout(timer) })
  input.addEventListener('compositionend', function () { composing = false; search() })
  retry.addEventListener('click', load)
  load()
})
