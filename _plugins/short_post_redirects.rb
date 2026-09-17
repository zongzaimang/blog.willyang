# frozen_string_literal: true

require "cgi"
require "uri"
require "json"

module ShortPostURLs
  def self.fail!(message)
    raise Jekyll::Errors::FatalException, message
  end

  class Redirects < Jekyll::Generator
    priority :lowest

    def generate(site)
      return unless site.config["short_post_urls"]

      occupied = {}
      reserve = lambda do |item|
        key = File.expand_path(item.destination(site.dest)).downcase
        ShortPostURLs.fail!("Output URL collision: #{item.url}") if occupied.key?(key)
        occupied[key] = item
      end
      (site.pages + site.collections.values.flat_map(&:docs).select(&:write?) + site.static_files).each(&reserve)

      site.posts.docs.each do |post|
        history = post.data.fetch("url_history", [])
        ShortPostURLs.fail!("url_history must be a list in #{post.relative_path}") unless history.is_a?(Array)
        history.uniq.each do |old|
          unless old.is_a?(String) && old.start_with?("/") && !old.start_with?("//") &&
                 !old.match?(/[?#\\]/) && (old.end_with?("/") || old.end_with?(".html"))
            ShortPostURLs.fail!("Invalid historical URL in #{post.relative_path}: #{old.inspect}")
          end
          decoded = URI::DEFAULT_PARSER.unescape(old)
          if decoded.split("/").any? { |part| part == "." || part == ".." } || decoded.include?("\\")
            ShortPostURLs.fail!("Unsafe historical URL: #{old}")
          end
          next if old == post.url

          path = decoded.end_with?("/") ? "#{decoded}index.html" : decoded
          page = Jekyll::PageWithoutAFile.new(site, site.source, File.dirname(path).sub(%r!\A/!, ""), File.basename(path))
          target = "#{site.baseurl}#{post.url}"
          canonical = "#{site.config['domainUrl']}#{target}"
          page.data = { "layout" => nil, "sitemap" => false }
          page.content = <<~HTML
            <!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
            <meta http-equiv="refresh" content="0;url=#{CGI.escapeHTML(target)}">
            <link rel="canonical" href="#{CGI.escapeHTML(canonical)}">
            <title>文章已迁移</title></head><body>
            <a href="#{CGI.escapeHTML(target)}">前往文章新地址</a>
            <script>location.replace(#{JSON.generate(target)} + location.search + location.hash);</script>
            </body></html>
          HTML
          reserve.call(page)
          site.pages << page
        end
      end
    end
  end
end
