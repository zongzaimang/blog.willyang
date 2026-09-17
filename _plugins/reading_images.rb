# frozen_string_literal: true

# Enrich rendered images without changing authored Markdown or fetching remote files.
module ReadingImages
  IMAGE_TAG = /<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/i

  def reading_images(content)
    index = 0
    content.to_s.gsub(IMAGE_TAG) do |tag|
      attributes = []
      attributes << 'decoding="async"' unless tag.match?(/\sdecoding\s*=/i)
      attributes << 'loading="lazy"' if index.positive? && !tag.match?(/\sloading\s*=/i)
      index += 1
      attributes.empty? ? tag : tag.sub(/<img\b/i, "<img #{attributes.join(' ')}")
    end
  end
end

Liquid::Template.register_filter(ReadingImages)
