module TweetsHelper

  def hash_tags
    HashTag.all.map{|h| h.to_s}
  end
  
end