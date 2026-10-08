# frozen_string_literal: true
require "cgi"

# Use measured headers only; never fetch remote images during a build.
module ReadingImages
  IMAGE_TAG = /<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/i

  def reading_images(content)
    index = 0
    site = @context&.registers&.dig(:site)
    dimensions = site ? site.data.fetch("image_dimensions", {}) : {}
    content.to_s.gsub(IMAGE_TAG) do |tag|
      attributes = []
      attributes << 'decoding="async"' unless tag.match?(/\sdecoding\s*=/i)
      attributes << 'loading="lazy"' if index.positive? && !tag.match?(/\sloading\s*=/i)
      src = tag[/\ssrc\s*=\s*["']([^"']+)["']/i, 1]
      size = dimensions[CGI.unescapeHTML(src.to_s)]
      if size && !tag.match?(/\s(?:width|height)\s*=/i)
        width, height = size.values_at("width", "height")
        if [width, height].all? { |value| value.is_a?(Integer) && value.positive? }
          attributes << "width=\"#{width}\" height=\"#{height}\""
        end
      end
      index += 1
      attributes.empty? ? tag : tag.sub(/<img\b/i, "<img #{attributes.join(' ')}")
    end
  end
end
Liquid::Template.register_filter(ReadingImages)
