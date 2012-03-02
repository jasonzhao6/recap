class TweetsController < ApplicationController
  layout :set_layout
  before_filter :check_140_chars, only: [:create, :update]
  
  # ajax, so respond inline for js to render
  def create
    hash_tag = find_or_create_hash_tag_from_params
    group = find_or_create_group_from_params
    group.inc
    tweet = Tweet.create params['tweet']
    if hash_tag.invalid? || tweet.invalid?
      group.dec
      render status: 400, inline: extract_first_error_message(hash_tag.errors.messages.merge tweet.errors.messages)
    else
      render status: 200, nothing: true # js will redirect to homepage, where the new tweet will show at the top
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
  
  def show
    @tweets = Tweet.find(params[:id]).related
  end
  
  # ajax, so respond inline for js to render
  def update
    tweet = Tweet.find params[:id] rescue render status: 500, inline: 'Tweet not found' and return
    old_hash_tag = tweet.hash_tag
    new_hash_tag = find_or_create_hash_tag_from_params
    tweet.update_attributes params['tweet']
    if new_hash_tag.invalid? || tweet.invalid?
      render status: 400, inline: extract_first_error_message(new_hash_tag.errors.messages.merge tweet.errors.messages)
    else
      old_hash_tag.delete if old_hash_tag.tweets.count == 0
      render status: 200, nothing: true # js will redirect to show page, where the updated tweet will be reflected
    end
  end
  
  # ajax, so respond inline for js to render
  COUNT = 20
  def quote
    begin
      response = HTTParty.get("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=motivation&count=#{COUNT}")
      render status: 200, inline: response[Random.rand(COUNT)]['text'].gsub('" - ', '"<br /><span id="author">- ').gsub(/\shttp.*\Z/, '</span>').html_safe
    rescue
      render status: 408, nothing: true # timeout
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

  def find_or_create_hash_tag_from_params
    # also update params for use with create and update_attributes
    params['tweet']['hash_tag'] = HashTag.find_or_create_by_hash_tag(params['tweet']['hash_tag'].downcase.gsub(/[^0-9a-z]/, ''))
  end

  def find_or_create_group_from_params
    # also update params for use with create and update_attributes
    # if group doesn't exist, just create a new one
    params['tweet']['group'] = Tweet.find(params['tweet']['group']).group rescue Group.create
  end
  
  def extract_first_error_message messages
    messages.map{|k, v| "#{k.to_s.capitalize.gsub(/\_/, ' ')} #{v.first}"}.first.to_s
  end
end