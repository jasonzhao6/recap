class TweetsController < ActionController::Base
  layout :set_layout
  
  def index
    query = params[:q].try(:downcase)
    if query
      if query[0] == '#'
        @tweets = Tweet.joins(:hash_tag).where('LOWER(name) like ?', "%#{query[1..-1]}%")
      else
        @tweets = Tweet.where('LOWER(body) like ?', "%#{query}%")
      end
    else
      @tweets = Tweet.all
    end
  end
  
  private
  
  def set_layout
   if request.headers['X-PJAX'] || params[:ajax] == 'true'
     false
   else
     'tweets'
   end
 end
  
end
