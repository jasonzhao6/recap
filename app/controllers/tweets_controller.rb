class TweetsController < ApplicationController
  layout :set_layout
  before_filter :check_140_chars, only: :create
  
  def create
    # find or create hash tag
    hash_tag = params['tweet']['hash_tag'] = HashTag.find_or_create_by_hash_tag(params['tweet']['hash_tag'].downcase.gsub(/[^0-9a-z]/, ''))
    # find or create group, then update group count
    group = params['tweet']['group'] = params['tweet']['group'] ? Tweet.find(params['tweet']['group']).group : Group.create
    group.inc
    # create tweet
    tweet = Tweet.create(params['tweet'])
    # response
    if hash_tag.invalid? || tweet.invalid?
      group.dec
      render status: 400, inline: (hash_tag.errors.messages.merge tweet.errors.messages).map{|k, v| "#{k.to_s.capitalize.gsub(/\_/, ' ')} #{v.first}"}.first.to_s
    else
      render status: 200, nothing: true
    end
  end
  
  def destroy
    tweet = Tweet.find params[:id]
    hash_tag = tweet.hash_tag
    group = tweet.group
    tweet.delete
    hash_tag.delete if hash_tag.tweets.count == 0
    group.dec
    redirect_to :root
  end
  
  def edit
    @tweet = Tweet.find params[:id]
  end

  def index
    if query = params[:q].try(:downcase)
      if query[0] == '#'
        @tweets = Tweet.joins(:hash_tag).where('LOWER(hash_tag) = ?', query[1..-1])
      else
        @tweets = Tweet.where('LOWER(tweet) like ?', "%#{query}%")
      end
    else
      @tweets = Tweet.all
    end
  end
  
  def new; end
  
  COUNT = 20
  def quote
    begin
      response = HTTParty.get("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=motivation&count=#{COUNT}")
      render status: 200, inline: response[Random.rand(COUNT)]['text'].gsub('" - ', '"<br /><span id="author">- ').gsub(/\shttp.*\Z/, '</span>').html_safe
    rescue
      render status: 400, nothing: true
    end
  end
  
  private
  
  def set_layout
    @ajax = params[:ajax] == 'true'
    @pjax = request.headers['X-PJAX'] == 'true'
    if @ajax || @pjax
      false
    else
      'tweets'
    end
 end
 
 def check_140_chars
   if params['tweet'].map{|k, v| %w(tweet hash_tag).include?(k) ? v : ''}.reduce(:+).length > 138 # length check, 138 chars because the ' #' between tweet and hash tag takes up 2 chars
     render status: 400, inline: '140 characters is the maximum allowed' and return
   end
 end

end