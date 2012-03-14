class HashTag < ActiveRecord::Base
  belongs_to :user
  has_many :tweets
  has_many :votes, through: :tweets
  
  validates_presence_of :hash_tag
  validates_presence_of :user_id
  
  def delete_if_not_used
    self.delete if self.tweets.count == 0
  end
  
  def to_s
    self.hash_tag
  end
end