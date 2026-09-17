# frozen_string_literal: true

require "date"

# Accept YYMMDD title.ext alongside Jekyll's standard YYYY-MM-DD-title.ext.
# Two-digit years explicitly mean 2000-2099, independent of Ruby's date pivot.
module CompactPostNames
  MATCHER = %r!\A(?:.*/)?(\d{2})(\d{2})(\d{2}) ([^/]+)(\.[^.\/]+)\z!
  POST_MATCHER = Regexp.union(Jekyll::Document::DATE_FILENAME_MATCHER, MATCHER)

  module Reader
    def read_posts(dir)
      read_publishable(dir, "_posts", POST_MATCHER)
    end
  end

  module Metadata
    private

    def populate_title
      match = MATCHER.match(relative_path)
      return super unless collection.label == "posts" && !draft? && match

      year, month, day, slug, ext = match.captures
      begin
        date = Date.new(2000 + year.to_i, month.to_i, day.to_i)
      rescue ArgumentError
        raise Jekyll::Errors::FatalException,
              "Invalid YYMMDD date in post filename: #{relative_path}"
      end

      # Use the same metadata rules as Jekyll's standard filename reader.
      # Explicit front matter continues to take precedence.
      modify_date(date.iso8601)
      data["title"] ||= Jekyll::Utils.titleize_slug(slug)
      data["slug"] ||= slug
      data["ext"] ||= ext
      if site.config["short_post_urls"]
        suffix = data["url_suffix"]
        unless (suffix.is_a?(Integer) || suffix.is_a?(String)) && suffix.to_s.match?(/\A[1-9][0-9]*\z/)
          raise Jekyll::Errors::FatalException, "Set url_suffix to a positive integer (1, 2, 3...) in #{relative_path}"
        end
        data["permalink"] = "/#{year}#{month}#{day}-#{suffix}/"
      end
    end
  end
end

Jekyll::PostReader.prepend(CompactPostNames::Reader)
Jekyll::Document.prepend(CompactPostNames::Metadata)
