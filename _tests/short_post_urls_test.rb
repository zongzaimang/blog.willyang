# frozen_string_literal: true

require_relative "compact_post_names_test"

settings = { "short_post_urls" => true, "domainUrl" => "https://example.com", "baseurl" => "/blog" }
body = "---\ntitle: Article\ndate: 2020-01-02\nurl_suffix: 2\nurl_history:\n  - /240909-2/\n  - /posts/2024/09/10/%E4%B8%AD%E6%96%87.html\n---\nText\n"
["240910 First.md", "240910 Renamed.md", "240911 Renamed.md"].each do |name|
  build_fixture({ name => body }, settings) do |site|
    post = site.posts.docs.first
    target = "/#{name[0, 6]}-2/"
    assert(post.url == target, "URL must follow filename date, not front matter date/title")
    assert(post.date.year == 2020, "Display date must still honor front matter")
    assert(site.pages.size == 2, "Historical redirects missing")
    site.pages.each do |page|
      assert(page.output.include?("/blog#{target}"), "Redirect must target current URL directly")
      assert(page.output.include?("https://example.com/blog#{target}"), "Canonical must target new URL")
      assert(File.file?(page.destination(site.dest)), "Redirect file missing")
    end
  end
end

%w[1 9 10 27].each do |suffix|
  build_fixture({ "240910 Article.md" => "---\nurl_suffix: #{suffix}\n---\nBody" }, settings) do |site|
    assert(site.posts.docs.first.url == "/240910-#{suffix}/", "Numeric suffix failed")
  end
end

def expect_failure(message)
  yield
  raise "Expected build failure: #{message}"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?(message), "Unexpected failure: #{error.message}")
end

expect_failure("url_suffix") do
  build_fixture({ "240910 Missing.md" => "---\n---\nBody" }, settings) {}
end
['0', '-1', '1.5', 'true', 'a', '"01"'].each do |invalid|
  expect_failure("url_suffix") do
    build_fixture({ "240910 Invalid.md" => "---\nurl_suffix: #{invalid}\n---\nBody" }, settings) {}
  end
end
expect_failure("Output URL collision") do
  build_fixture({ "240910 First.md" => body, "240910 Second.md" => body }, settings) {}
end
expect_failure("Output URL collision") do
  build_fixture({ "240910 First.md" => body }, settings, { "240910-2/index.html" => "Static page" }) {}
end
expect_failure("Output URL collision") do
  build_fixture({ "240910 First.md" => body, "240909 Other.md" => "---\nurl_suffix: 2\n---\nText" }, settings) {}
end
puts "PASS: filename-driven URLs, stable suffixes, redirects, explicit dates, and output collisions"
