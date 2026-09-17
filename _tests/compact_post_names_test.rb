# frozen_string_literal: true

require "jekyll"
require "tmpdir"
require "fileutils"

def assert(condition, message)
  raise message unless condition
end

def build_fixture(files, extra = {}, root_files = {})
  Dir.mktmpdir("compact-posts-") do |source|
    files.each do |name, content|
      path = File.join(source, "_posts", name)
      FileUtils.mkdir_p(File.dirname(path))
      File.write(path, content)
    end
    root_files.each do |name, content|
      path = File.join(source, name)
      FileUtils.mkdir_p(File.dirname(path))
      File.write(path, content)
    end
    config = Jekyll.configuration({
      "source" => source,
      "destination" => File.join(source, "_site"),
      "plugins_dir" => File.expand_path("../_plugins", __dir__),
      "permalink" => "/posts/:year/:month/:day/:title.html",
      "time" => Time.utc(2026, 9, 17),
      "strict_front_matter" => true,
      "quiet" => true,
    }.merge(extra))
    site = Jekyll::Site.new(config)
    Dir.chdir(source) { site.process }
    yield site
  end
end

body = "---\nlayout: null\ntitle: 自定义标题\ncategories: [测试]\n---\nHello **world**.\n"
metadata = lambda do |site|
  site.posts.docs.map do |post|
    [post.url, post.date.iso8601, post.data["title"], post.data["slug"],
     post.data["categories"], post.output]
  end
end

before = nil
build_fixture({ "2015-01-01-主题预览.md" => body,
                "2024-02-29-Space title.v2.md" => body }) do |site|
  before = metadata.call(site)
end
build_fixture({ "150101 主题预览.md" => body,
                "240229 Space title.v2.md" => body }) do |site|
  assert(metadata.call(site) == before, "Rename changed URLs, dates, order, metadata or HTML")
end

override = "---\ntitle: Explicit\ndate: 2020-03-04\nslug: original-url\n---\nBody\n"
build_fixture({ "150101 New title.md" => override,
                "2022-05-15-legacy.md" => body,
                "990101 Future.md" => body,
                "not-a-post.md" => body }) do |site|
  assert(site.posts.docs.size == 2, "Legacy or future-post filtering failed")
  post = site.posts.docs.first
  assert(post.url == "/posts/2020/03/04/original-url.html", "Front matter overrides lost")
  assert(post.data["title"] == "Explicit", "Explicit title lost")
end

build_fixture({ "990101 Future.md" => body }, "future" => true) do |site|
  assert(site.posts.docs.first.date.year == 2099, "Two-digit year used an implicit century pivot")
end

build_fixture({ "240229 fallback-title.md" => "---\n---\nBody\n" }) do |site|
  assert(site.posts.docs.first.data["title"] == Jekyll::Utils.titleize_slug("fallback-title"),
         "Filename title fallback changed")
end

begin
  build_fixture({ "230229 Invalid.md" => body }) { raise "Invalid date was accepted" }
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("Invalid YYMMDD date"), "Unexpected build failure")
end

puts "PASS: compact filenames, unchanged HTML/URLs/order, legacy names, metadata overrides, leap dates and future filtering"
