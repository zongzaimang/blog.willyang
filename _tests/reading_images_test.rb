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
