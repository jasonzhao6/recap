class Tweet < ActiveRecord::Base
  belongs_to :hash_tag
  has_many :votes
  
  validates_presence_of :tweet
  validates_presence_of :hash_tag
  
  def to_s
    self.tweet
  end
end