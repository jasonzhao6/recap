module TweetsHelper
  def hash_tags
    HashTag.all.map{|h| h.to_s}
  end
  
  def quote
    begin
      count = 20
      response = HTTParty.get("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=motivation&count=#{count}")
      response[Random.rand(count)]['text']
    rescue; end
  end
end