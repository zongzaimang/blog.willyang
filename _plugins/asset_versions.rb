# frozen_string_literal: true
require "digest"

module AssetVersions
  def asset_version(path)
    site = @context.registers[:site]
    site.config["asset_versions"] ||= {}
    site.config["asset_versions"][path] ||= Digest::SHA256.file(File.join(site.source, path.sub(%r!\A/!, ""))).hexdigest[0, 12]
  end

  class SearchVersion < Jekyll::Generator
    priority :low
    def generate(site)
      site.config["asset_versions"] = {} # Recompute on every watch rebuild.
      # Match the index order and include URLs to invalidate equal-sized edits.
      contents = site.posts.docs.reverse.map { |post| [post.url, post.data["title"], post.content] }
      template = File.join(site.source, "static/xml/search.xml")
      index_template = File.file?(template) ? File.read(template) : ""
      site.config["search_version"] = Digest::SHA256.hexdigest(Marshal.dump([contents, index_template, site.config["kramdown"]]))[0, 16]
    end
  end
end
Liquid::Template.register_filter(AssetVersions)
