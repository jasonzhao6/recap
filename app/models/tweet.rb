class Tweet < ActiveRecord::Base
  belongs_to :hash_tag
  belongs_to :ancestor, class_name: 'Tweet', foreign_key: 'ancestor_id'
  
  default_scope :include => :hash_tag, :order => ['tweets.created_at DESC']
  
  validates_presence_of :tweet
  validates_presence_of :hash_tag_id
  
  def length # of tweet + hashtag
    self.to_s.length + self.hash_tag.to_s.length + 2
  end
  
  def related
    Tweet.where ancestor_id: ancestor
  end
  
  def to_s # of just tweet
    self.tweet
  end
end