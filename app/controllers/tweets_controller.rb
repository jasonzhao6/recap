class TweetsController < ActionController::Base
  layout :set_layout
  
  def create
    hash_tag = params['tweet']['hash_tag'] = HashTag.find_or_create_by_hash_tag(params['tweet']['hash_tag'].downcase.gsub(/[^0-9a-z]/, ''))
    tweet = Tweet.create(params['tweet'])
    if hash_tag.invalid? || tweet.invalid?
      render status: 400, inline: (hash_tag.errors.messages.merge tweet.errors.messages).map{|k, v| "#{k.to_s.capitalize.gsub(/\_/, ' ')} #{v.first}"}.first.to_s
    else
      render status: 200, nothing: true
    end
  end
  
  def index
    if query = params[:q].try(:downcase)
      if query[0] == '#'
        @tweets = Tweet.joins(:hash_tag).where('LOWER(hash_tag) like ?', "%#{query[1..-1]}%")
      else
        @tweets = Tweet.where('LOWER(tweet) like ?', "%#{query}%")
      end
    else
      @tweets = Tweet.all
    end
  end
  
  def new
  end
  
  def quote
    begin
      count = 20
      response = HTTParty.get("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=motivation&count=#{count}")
      render status: 200, inline: response[Random.rand(count)]['text'].gsub('" - ', '"<br /><span id="author">- ').gsub(/\shttp.*\Z/, '</span>').html_safe
    rescue
      render status: 400, nothing: true
    end
  end
  
  private
  
  def set_layout
    @ajax_search = params[:ajax_search] == 'true'
    if request.headers['X-PJAX'] || @ajax_search
      false
    else
      'tweets'
    end
 end
  
end
