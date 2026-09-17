# 介绍

[![Language](https://img.shields.io/badge/Jekyll-Theme-blue)](https://github.com/TMaize/tmaize-blog)
[![license](https://img.shields.io/github/license/TMaize/tmaize-blog)](https://github.com/TMaize/tmaize-blog)
[![GitHub stars](https://img.shields.io/github/stars/TMaize/tmaize-blog?style=social)](https://github.com/TMaize/tmaize-blog)

一款 jekyll 主题（[GitHub 地址](https://github.com/TMaize/tmaize-blog)），简洁纯净(主题资源请求<20KB)，未引入任何框架，秒开页面，支持自适应，支持全文检索，支持夜间模式

你点击[这里](https://www.willyang.space/)查看主题效果

## 感谢

[JetBrains](https://www.jetbrains.com/?from=tmaize-blog) 免费提供的开发工具[![JetBrains](./static/img/jetbrains.svg)](https://www.jetbrains.com/?from=tmaize-blog)

[夜间模式代码高亮配色](https://github.com/mgyongyosi/OneDarkJekyll)

# 本地运行

一般提交到 github 过个几十秒就可以看到效果，如果你需要对在本地查看效果需要安装 ruby 环境和依赖

windows 下推荐在 wsl 下装 ruby，直接一句`apt install build-essential ruby ruby-dev` 就行了

```bash
# gem sources --remove https://rubygems.org/
# gem sources -a https://mirrors.tuna.tsinghua.edu.cn/rubygems/
# gem sources -l
# gem sources --clear-all
# gem sources --update
gem install bundler
# bundle config mirror.https://rubygems.org https://mirrors.tuna.tsinghua.edu.cn/rubygems
# bundle config list
bundle install
```

通过下面命令启动/编译项目

```bash
bundle exec jekyll serve --watch --host=127.0.0.1 --port=8080
bundle exec jekyll build --destination=dist
```

## 日常发布流程

1. 在 Obsidian 中新建或编辑 `_posts` 下的 Markdown 文章；文章图片和附件放在对应的 `posts/YYYY/MM/DD/` 目录。
2. 提交并推送内容改动到 `main`。`main` 是生产分支，推送后会由 GitHub Actions 自动构建并发布到 GitHub Pages。
3. 如需改主题、布局或进行较大调整，请先建立分支；提交 Pull Request 后，工作流只做构建验证，不会影响线上网站。

工作流使用本仓库锁定的 `Gemfile.lock` 安装依赖，因此线上构建过程是可复现的。若希望在发布前预览，请在 WSL 或其他已安装 Ruby/Bundler 的环境中执行：

```bash
bundle install
bundle exec jekyll serve --watch --host=127.0.0.1 --port=8080
```

`OneDrive` 用于跨设备同步，GitHub 用于版本历史和异地副本。Obsidian 的窗口、标签页等个人工作区状态不会再作为日常内容改动提交。

### GitHub Pages 首次切换

在仓库的 **Settings → Pages → Build and deployment** 中将来源改为 **GitHub Actions**。自定义域名仍在该页面设置为 `blog.willyang.space`；使用 Actions 发布时，GitHub 以 Pages 设置中的域名为准。

如果需要替换代码高亮的样式可以通过下面的命令生成 css

```bash
rougify help style
rougify style github > highlighting.css
```

# 项目配置

1. 如果使用自己的域名，`CNAME`文件里的内容请换成你自己的域名，然后 CNAME 解析到`用户名.github.com`

2. 如果使用 GitHub 的的域名，请删除`CNAME`文件，然后把你的项目修改为`用户名.github.io`

3. 修改`pages/about.md`中关于我的内容

4. 修改`_config.yml`文件，具体作用请参考注释

5. 清空`posts`和`_posts`目录下所有文件，注意是清空，不是删除这两个目录

6. 网站的 logo 和 favicon 放在了`static/img/`下，替换即可，大小无所谓，图片比例最好是 1:1

7. 如果你是把项目 fork 过去的，想要删除我的提交记录可以使用下面的命令

   ```
   git checkout --orphan temp
   git add . && git commit -m init
   git branch -D master
   git branch -m temp master
   git push --force
   ```

# 使用

文章放在`_posts`目录下，命名为`YYMMDD 标题.md`，日期与标题之间使用一个半角空格，例如 `150101 主题预览.md`、`251229 Spotify PWA.md`。保留 `.md` 扩展名，内容格式如下

```yaml
---
layout: mypost
title: 标题
categories: [分类1, 分类2]
url_suffix: 1
url_history:
  - /150101-1/
---
文章内容，Markdown格式
```

`_plugins/compact_post_names.rb` 负责识别短日期文件名：`YY` 表示 2000–2099 年，`150101` 表示 2015 年 1 月 1 日。日期必须有效；显式填写的 front matter `date`、`title`、`slug` 仍按 Jekyll 规则生效。旧的 `YYYY-MM-DD-title.md` 格式也兼容。

启用 `short_post_urls` 后，网址为 `/文件名六位日期-url_suffix/`，例如 `240910 机场推荐.md` 配合 `url_suffix: 1` 生成 `/240910-1/`。网址只读取文件名日期，不读取 front matter 的发布日期；修改标题不会改变网址，修改文件名日期会改变网址。无需填写 `permalink`，插件会生成它。

同日期的文章分别填写固定的 `1、2、3……`（正整数，不使用前导零），已有后缀不自动重排。新增文章或改日期时选择未占用的后缀；与文章、普通页面、静态文件或历史跳转地址冲突时构建会失败。

`url_history` 保存这篇文章使用过的地址（含当前地址）。改日期或后缀前保留旧地址，发布新地址时把它追加到列表中，不删除旧记录。构建只读取这些记录，不修改文章源文件；未记录的历史地址无法自动恢复。历史地址生成静态跳转页，直接指向当前地址，并保留浏览器查询参数与锚点；GitHub Pages 上这不是 HTTP 301。删除文章后若需要继续保留链接，应保留单独的跳转页。

本地运行和 GitHub Actions 构建都会加载这些插件；不要使用 `--safe`，也不要切换为 GitHub Pages 内置的分支构建。修改插件后需要重启本地预览。可运行 `bundle exec ruby _tests/short_post_urls_test.rb` 验证文件名、短链接及冲突检查。

文章资源仍可放在 `posts/2019/05/01` 等原有目录。短网址改变了页面层级，图片和附件请使用以 `/` 开头的站内绝对路径，不要依赖文章网址所在目录。

```md
![这是图片](/posts/2019/05/01/xxx.png)

[xxx.zip 下载](/posts/2019/05/01/xxx.zip)
```

## 视觉设计与验收

页面采用系统字体、独立的正文阅读宽度和浅深色语义配色。`static/css/common.css` 定义通用颜色、间距和导航，`theme-dark.css` 定义深色变量，`page.css` 与 `post.css` 分别管理列表和文章页面。外观选择位于页头，支持跟随系统、浅色和深色；手动偏好不会被系统变化覆盖。

文章目录在至少有三个一至三级标题时生成：宽屏使用侧栏，小屏使用可展开目录。文章列表使用内容区查询适配文字放大；返回顶部位于页尾，不覆盖正文。代码块和表格可独立滚动；图片预览支持键盘操作、Esc 关闭和长图展开。`reading_images` 过滤器为后续图片增加延迟加载，同时保留作者指定的加载方式和尺寸。远程图片的尺寸应在内容中明确填写；构建不会请求第三方图片或推测其尺寸。

运行构建和 Ruby 回归检查：

```sh
bundle exec jekyll build
bundle exec ruby _tests/short_post_urls_test.rb
bundle exec ruby _tests/reading_images_test.rb
```

浏览器验收需要可用的 Playwright 包和 Chrome 或 Edge。先将 `_site` 通过本地 HTTP 服务运行在 4173 端口，再执行：

```sh
node _tests/visual_design_test.cjs
node _tests/adversarial_visual_test.cjs
```

可用环境变量：`DESIGN_BASE_URL` 修改预览地址、`BROWSER_CHANNEL` 选择 `chrome` 或 `msedge`（默认）、`DESIGN_OUTPUT` 修改截图及结果目录（默认 `.bundle/design-review`，不会发布）。脚本检查全部当前文章和主要页面的七种宽度、两种主题，以及搜索成功/失败/重试、主题偏好、菜单、图片键盘操作、减少动效和文字放大。布局矩阵隔离第三方网络媒体；远程图片可用性需另行检查。自动化检查不等同于完整的 WCAG 人工审核或真机验证。

`adversarial_visual_test.cjs` 额外覆盖 100%/200% 文字尺寸下的标题有效宽度、分类链接点击命中、页尾返回顶部、全部语法 token 在普通/高亮行背景下的对比度、页头主题偏好和统一图标。结果位于 `.bundle/adversarial-fixed/<浏览器名称>`。
