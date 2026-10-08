# frozen_string_literal: true

require "liquid"
require_relative "../_plugins/reading_images"
include ReadingImages

def check(condition, message)
  raise message unless condition
end

first, second = reading_images('<img src="a.png"><img src="b.png">').scan(ReadingImages::IMAGE_TAG)
check(!first.include?('loading='), "First image must not be deferred")
check(second.include?('loading="lazy"'), "Later images must be deferred")
check(first.include?('decoding="async"'), "Image decoding should not block rendering")
original = '<img loading="eager" decoding="sync" width="500" height="250" src="x.png">'
check(reading_images(original) == original, "Explicit author attributes must be preserved")
quoted = reading_images('<img alt="a > b" src="a.png"><img alt="c" src="b.png" />')
check(quoted.include?('alt="a > b"'), "Quoted angle brackets must remain intact")
check(quoted.scan('loading="lazy"').length == 1, "Only the later image should be deferred")
puts "PASS: responsive reading image loading, explicit attributes, and quoted markup"

# Rendering must use measured dimensions while preserving author overrides.
site = Struct.new(:data).new({ "image_dimensions" => {
  "https://example.com/a.png?x=1&y=2" => { "width" => 1200, "height" => 800 },
  "/invalid.png" => { "width" => 0, "height" => 12 }
} })
@context = Liquid::Context.new({}, {}, { site: site })
known = reading_images('<img src="https://example.com/a.png?x=1&amp;y=2">')
check(known.include?('width="1200" height="800"'), "Measured dimensions missing or escaped URL lookup failed")
partial = '<img width="300" src="https://example.com/a.png?x=1&amp;y=2">'
check(!reading_images(partial).include?('height='), "Partial author sizing must remain unchanged")
check(!reading_images('<img src="/invalid.png">').include?('width='), "Invalid measurements must be ignored")
puts "PASS: measured dimensions, escaped URLs, explicit sizing and invalid metadata"
