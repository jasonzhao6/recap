class TweetsController < ActionController::Base
  layout :set_layout
  
  def index
    if query = params[:q].try(:downcase)
      if query[0] == '#'
        @tweets = Tweet.joins(:hash_tag).where('LOWER(name) like ?', "%#{query[1..-1]}%")
      else
        @tweets = Tweet.where('LOWER(body) like ?', "%#{query}%")
      end
    else
      @tweets = Tweet.all
    end
  end
  
  def new
    count = 20
    response = HTTParty.get('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=motivation&count=' + count.to_s)
    @quote = response[Random.rand(count)]['text'] rescue nil
  end
  
  private
  
  def set_layout
    @ajax = params[:ajax] == 'true'
    if request.headers['X-PJAX'] || @ajax
      false
    else
      'tweets'
    end
 end
  
end
