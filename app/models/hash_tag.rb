class HashTag < ActiveRecord::Base
  has_many :tweets
  has_many :votes, through: :tweets
end