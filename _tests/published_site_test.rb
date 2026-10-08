# frozen_string_literal: true
require "uri"
require "cgi"
require "rexml/document"
require "date"

root = File.expand_path(ARGV.fetch(0, "_site"))
raise "Build directory is missing: #{root}" unless File.directory?(root)
errors = []
resolve = lambda do |url, current|
  decoded = URI::DEFAULT_PARSER.unescape(CGI.unescapeHTML(url).split(/[?#]/, 2).first.to_s)
  path = decoded.start_with?("/") ? File.join(root, decoded.sub(%r!\A/!, "")) : File.expand_path(decoded, File.dirname(current))
  File.file?(path) ? path : File.join(path, "index.html")
end
html_files = Dir.glob(File.join(root, "**", "*.html"))
html_files.each do |file|
  html = File.read(file, encoding: "UTF-8")
  html.scan(/\s(?:href|src)\s*=\s*["']([^"']+)["']/i).flatten.each do |url|
    next if url.empty? || url.start_with?("#", "//") || url.match?(/\A[a-z][a-z0-9+.-]*:/i)
    errors << "Missing resource in #{file.delete_prefix(root)}: #{url}" unless File.file?(resolve.call(url, file))
  end
  html.scan(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/i).each do |tag|
    src = tag[/\ssrc=["']([^"']+)["']/i, 1].to_s
    alt = tag[/\salt=["']([^"']*)["']/i, 1].to_s
    decorative = tag.match?(/(?:role=["']presentation|aria-hidden=["']true)/i)
    errors << "Malformed image URL in #{file.delete_prefix(root)}" if src.match?(/[\r\n]/)
    errors << "Image description missing in #{file.delete_prefix(root)}" if !tag.match?(/\salt\s*=/i) && !decorative
  end
  canonical = html[/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i, 1]
  if canonical
    local = resolve.call(URI.parse(CGI.unescapeHTML(canonical)).path, file)
    errors << "Invalid canonical in #{file.delete_prefix(root)}" unless File.file?(local)
  end
end
rss = REXML::Document.new(File.read(File.join(root, "static/xml/rss.xml"), encoding: "UTF-8"))
items = REXML::XPath.match(rss, "/rss/channel/item")
guids = items.map do |item|
  guid = item.elements["guid"]
  raise "RSS item has no permalink GUID" unless guid && guid.attributes["isPermaLink"] == "true" && guid.text == item.elements["link"].text
  raise "RSS item has an empty title" if item.elements["title"].text.to_s.empty?
  raise "RSS article does not exist" unless File.file?(resolve.call(URI.parse(guid.text).path, root))
  guid.text
end
raise "RSS GUIDs must be unique and nonempty" if guids.empty? || guids.uniq.length != guids.length
sitemap = REXML::Document.new(File.read(File.join(root, "static/xml/sitemap.xml"), encoding: "UTF-8"))
locations = []
sitemap.root.elements.each("url") do |entry|
  url = entry.elements["loc"].text
  locations << url
  errors << "Missing sitemap target: #{url}" unless File.file?(resolve.call(URI.parse(url).path, root))
  date = entry.elements["lastmod"]&.text
  errors << "Future sitemap date: #{date}" if date && Date.iso8601(date) > Date.today
end
raise "Sitemap URLs must be unique" unless locations.uniq.length == locations.length
raise "RSS articles absent from sitemap" unless (guids - locations).empty?
["service-worker.js", "static/font/consola.ttf", "static/img/wy-angular-v3.png", "static/img/wy-monogram-v1.png", "static/img/wy-separated-v2.png", "tools/refresh-image-dimensions.py", "Pasted image 20260917104537.png"].each do |path|
  errors << "Non-production file was published: #{path}" if File.exist?(File.join(root, path))
end
raise errors.join("\n") unless errors.empty?
puts "PASS: #{html_files.size} HTML files, local references, canonical targets, #{guids.size} RSS GUIDs, sitemap and publication exclusions"
