class Tweet < ActiveRecord::Base
  belongs_to :hash_tag
  has_many :votes
end