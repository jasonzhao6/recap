class Tweet < ActiveRecord::Base
  belongs_to :hash_tag
  has_many :votes
  
  default_scope :include => :hash_tag, :order => ['tweets.created_at DESC']
  
  validates_presence_of :tweet
  validates_presence_of :hash_tag_id
  
  def length
    self.to_s.length + self.hash_tag.to_s.length + 2
  end
  
  def to_s
    self.tweet
  end
end