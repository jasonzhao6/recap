class HashTag < ActiveRecord::Base
  belongs_to :user
  has_many :tweets
  has_many :votes, through: :tweets
  
  validates_presence_of :hash_tag
  validates_presence_of :user_id
  
  def to_s
    self.hash_tag
  end
end