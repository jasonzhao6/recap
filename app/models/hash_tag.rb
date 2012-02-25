class HashTag < ActiveRecord::Base
  has_many :tweets
  has_many :votes, through: :tweets
  
  validates_presence_of :hash_tag
  
  def to_s
    self.hash_tag
  end
end