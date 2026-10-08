# Will Yang Blog

个人博客，使用 Jekyll 构建，由 GitHub Actions 发布到 GitHub Pages：
[blog.willyang.space](https://blog.willyang.space/)。主题基于 [TMaize/tmaize-blog](https://github.com/TMaize/tmaize-blog)，保留原项目的 MIT 许可。

## 写作与文章网址

文章放在 `_posts/`，命名为 `YYMMDD 标题.md`，日期与标题之间使用半角空格。

```yaml
---
layout: mypost
title: 标题
categories: [分类]
url_suffix: 1
url_history:
  - /260108-1/
---
```

短网址由文件名日期与固定 `url_suffix` 组成。两位年份表示 2000–2099 年；旧的 `YYYY-MM-DD-title.md` 格式也兼容。
同一天的后缀使用不同正整数，不自动重排。改标题不会改变网址；改文件名日期或后缀前，把旧地址保留在 `url_history`，再追加新地址。
插件会检查文章、页面、静态文件和历史跳转之间的输出冲突。历史跳转保留查询参数和锚点，在 GitHub Pages 上是静态跳转页。
不要使用 `--safe` 或切换为 Pages 内置分支构建，否则自定义插件无法运行。

需要精确控制搜索摘要和分享文字时，可填写 `description`；未填写时使用文章摘要。
文章实质更新后，可填写 `updated_at: YYYY-MM-DD`，供站点地图使用；未填写时使用发布日期，不将构建日期当作更新时间。

本地图片使用站内绝对路径，例如 `![网络配置](/posts/2022/05/15/network.png)`。
可以沿用 `posts/YYYY/MM/DD/` 目录。保持已有图片地址稳定，不依赖短网址所在的目录层级。

## 本地预览与检查

通用 Ruby/Bundler 环境：

```sh
bundle install
bundle exec jekyll serve --watch --host=127.0.0.1 --port=4000
bundle exec jekyll build --destination _site
bundle exec ruby _tests/short_post_urls_test.rb
bundle exec ruby _tests/asset_versions_test.rb
bundle exec ruby _tests/reading_images_test.rb
bundle exec ruby _tests/published_site_test.rb _site
```

本机 Windows 已配置便携预览环境时，可运行：

```powershell
& .bundle/preview/preview.ps1
& .bundle/preview/preview.ps1 -Build
```

`.bundle/` 是忽略提交的本机环境，脚本和依赖路径不保证跨设备通用。便携环境使用自己的 Windows 依赖锁；生产依赖以根目录 `Gemfile.lock` 为准。
修改 `_config.yml` 或插件后重启预览。正文修改可触发重新构建，浏览器需手动刷新。

## 页面与视觉验收

`_includes/` 管理共享页头、元数据和脚本，`_layouts/` 管理页面结构。
`common.css` 和 `theme-dark.css` 定义通用配色，`page.css`、`post.css` 分别管理列表和阅读页面。
品牌原件是 `static/img/wy-logo.svg`，兼容 PNG/ICO 应从 SVG 重新生成。
导航、主题按钮、文章目录、图片预览与可滚动表格支持键盘操作和减少动效。
主题初始跟随系统，手动切换会保存偏好；清除浏览器的 `theme` 存储可恢复跟随系统。

浏览器验收需要 Node.js、Playwright 和已安装的 Edge 或 Chrome。先以本地 HTTP 服务提供 `_site`，再运行：

```sh
node _tests/visual_design_test.cjs
node _tests/adversarial_visual_test.cjs
```

`DESIGN_BASE_URL` 指定服务地址（默认 `http://127.0.0.1:4173`），`BROWSER_CHANNEL` 指定 `msedge` 或 `chrome`。
视觉测试用 `DESIGN_OUTPUT` 指定结果目录，默认 `.bundle/design-review`；对抗测试结果位于 `.bundle/adversarial-fixed/<浏览器>`。
测试涵盖主要页面和当前文章、多种宽度、浅深色、搜索成功/失败/重试、主题偏好、菜单、图片键盘操作、200% 字号及代码对比度。
第三方网络媒体被隔离；测试通过不代表外部图片或链接可用，也不等同于完整的人工无障碍审核。

## 图片尺寸与资源缓存

`_data/image_dimensions.json` 保存从实际图片头读取的尺寸。图片过滤器仅在作者未指定宽高时补充已知尺寸，为后续图片增加延迟加载，并保留显式加载设置。
构建过程不联网、不猜测远程图片尺寸。新增或更换图片后，可使用安装了 Pillow 的 Python 更新尺寸：

```sh
python tools/refresh-image-dimensions.py _site
```

先构建，再测量，最后重新构建并检查。测量失败会报告地址，并保留原有测量记录；同一地址替换了图片时，应重新确认旧尺寸。
CSS/JS 版本取决于文件内容；搜索索引版本取决于文章内容、标题、地址和顺序。仅重建网站不会使这些缓存失效。
全文搜索脚本只在搜索页加载，索引加载失败时仍支持标题搜索。

## 发布与保留材料

`main` 推送会构建、检查并发布；Pull Request 只验证构建。工作流包含网址、缓存、图片过滤器、站内资源、规范网址、RSS GUID 与站点地图检查。
Pages 的来源应选择 GitHub Actions，自定义域名在 Pages 设置中配置为 `blog.willyang.space`。
推送完成与部署完成是两件事；发布后检查对应提交的 Actions 结果及线上页面。

提交时明确选择本次文件，保留其他写作改动。OneDrive 用于同步，Git 用于版本历史。Obsidian 本机工作区不提交，共享配置与迁移材料继续保留。
旧标志、字体、设计候选图、根目录粘贴图片和旧 Service Worker 源文件仍保留，但从生产构建排除。
Service Worker 当前未注册；如将来启用，需要先修复缓存安装/清理的异步生命周期，并单独验收更新与离线行为。
旧 `blog.sh` 是主题遗留脚本，当前发布使用 Actions；不使用其中的 COS/CDN 部署命令。
友链缺少网址时显示占位，不编造链接。AdSense、MathJax、访问量统计默认关闭，启用前核对供应方配置。
