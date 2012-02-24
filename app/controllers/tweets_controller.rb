class TweetsController < ActionController::Base
  
  def index
    if params[:q]
      if params[:q][0] == '#'
        @tweets = HashTag.where('name like ?', "%#{params[:q][1..-1]}%").first.try(:tweets)
      else
        @tweets = Tweet.where('body like ?', "%#{params[:q]}%")
      end
    else
      @tweets = Tweet.all
    end
  end
  
end
