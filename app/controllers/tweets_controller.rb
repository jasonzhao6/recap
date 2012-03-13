class TweetsController < ApplicationController
  layout :set_layout
  before_filter :authenticated?
  before_filter :check_140_chars_and_trim, only: [:create, :update] # this should probably be done at the model level, but since it involves 2 separate models, it made sense to do it here
  
   # via ajax
   # on error, return error message with 400, client should show error message
   # on success, return nothing with 200, client should redirect to homepage
  def create
    hash_tag = find_or_create_hash_tag_from_params
    group = find_or_create_group_from_params
    group.inc
    tweet = Tweet.create params['tweet']
    if hash_tag.invalid? || tweet.invalid?
      group.dec
      render status: 400, inline: extract_first_error_message(hash_tag.errors.messages.merge tweet.errors.messages)
    else
      render status: 200, inline: tweet.id.to_s
    end
  end
  
  # delete this tweet
  def destroy
    # gather everything affected by this delete action
    tweet = Tweet.find params[:id]
    hash_tag = tweet.hash_tag
    group = tweet.group

    # if origin is :show, we want to return to :show, showing the tweet previous to this one
    if params[:origin] == 'show'
      this_index = tweet.related.index tweet
      prev_index = this_index > 0 ? this_index - 1 : 0
      related_remainder = tweet.related - Array(tweet)
    end

    # go ahead with the delete
    tweet.delete
    hash_tag.delete if hash_tag.tweets.count == 0 # if its hash tag is not used by any other tweet, delete the hash tag
    group.dec

    # return to either :show or the last :index user was on retaining any search query and pagination info
    if params[:origin] == 'show'
      redirect_to related_remainder.length > 0 ? tweet_path(related_remainder[prev_index], q: params[:q], page: params[:page]) : :root
    else
      redirect_to tweets_path(q: params[:q], page: params[:page])
    end
  end
  
  # show the tweet we are editing
  def edit
    @tweet = Tweet.find params[:id]
  end

  # show all tweets; handle search queries and pagination
  def index
    query = params[:q].try(:downcase)
    if query.blank?
      @tweets = Tweet.paginate(page: params[:page])
    else
      if query[0] == '#'
        @tweets = Tweet.joins(:hash_tag).where('LOWER(hash_tag) = ?', query[1..-1]).paginate(page: params[:page])
        if @tweets.length == 0
          @tweets = Tweet.joins(:hash_tag).where('LOWER(hash_tag) like ?', "%#{query[1..-1]}%").paginate(page: params[:page])
        end
      else
        @tweets = Tweet.where('LOWER(tweet) like ?', "%#{query}%").paginate(page: params[:page])
      end
    end
  end
  
  def new; end
  
  # show the tweet that we are replying to
  def reply
    @tweet = Tweet.find params[:tweet_id] if params[:tweet_id]
  end
  
  # show this tweet in a slide gallery with its related tweets
  def show
    tweet = Tweet.find params[:id]
    @tweets = tweet.related
    @start_index = @tweets.index tweet
  end
  
  # via ajax
  # on error, return error message with 400, client should show error message
  # on success, return nothing with 200, client should redirect to either :show or :index
  def update
    tweet = Tweet.find params[:id] rescue render status: 500, inline: 'Tweet not found' and return
    old_hash_tag = tweet.hash_tag
    new_hash_tag = find_or_create_hash_tag_from_params
    tweet.update_attributes params['tweet']
    if new_hash_tag.invalid? || tweet.invalid?
      render status: 400, inline: extract_first_error_message(new_hash_tag.errors.messages.merge tweet.errors.messages)
    else
      old_hash_tag.delete if old_hash_tag.tweets.count == 0
      render status: 200, nothing: true
    end
  end
  
  # via ajax
  # on error, return nothing with 408
  # on success, return quote with 200
  COUNT = 20
  def quote
    begin # TODO VCR this guy, but write another test that tests this live.
      response = HTTParty.get("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=motivation&count=#{COUNT}")
      render status: 200, inline: response[Random.rand(COUNT)]['text'].gsub('" - ', '"<br /><span id="author">- ').gsub(/\shttp.*\Z/, '</span>').html_safe
    rescue
      render status: 408, nothing: true # timeout
    end
  end
  
  private
  
  def set_layout
    @ajax = request.headers['X-AJAX'] == 'true'
    @pjax = request.headers['X-PJAX'] == 'true'
    if @ajax || @pjax
      false
    else
      'tweets'
    end
  end
  
  def authenticated?
    if !current_user
      redirect_to login_path and return
    end
  end

  def check_140_chars_and_trim
    params['tweet']['tweet'].strip!
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