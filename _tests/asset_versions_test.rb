# frozen_string_literal: true
require_relative "compact_post_names_test"

page = "---\n---\n{{ '/static/css/common.css' | asset_version }}|{{ site.search_version }}"
root_files = { "index.html" => page, "static/css/common.css" => "body{color:black}" }
body = "---\ntitle: First\n---\nOriginal content"
versions = lambda do |contents, time, roots|
  result = nil
  build_fixture({ "240910 First.md" => contents }, { "time" => time }, roots) do |site|
    result = site.pages.find { |p| p.name == "index.html" }.output.strip.split("|")
  end
  result
end
first = versions.call(body, Time.utc(2026, 9, 17), root_files)
later = versions.call(body, Time.utc(2026, 10, 8), root_files)
assert(first == later, "Build time must not invalidate unchanged assets or search index")
edited = versions.call(body.sub("Original", "Changed"), Time.utc(2026, 10, 8), root_files)
assert(first[0] == edited[0] && first[1] != edited[1], "Article edit must invalidate only the index")
new_css = versions.call(body, Time.utc(2026, 10, 8), root_files.merge("static/css/common.css" => "body{color:blue}"))
assert(first[0] != new_css[0] && first[1] == new_css[1], "Stylesheet edit must invalidate only the asset")
puts "PASS: content-based asset and search cache invalidation"
