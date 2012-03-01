class Group < ActiveRecord::Base
  has_many :tweets
  
  def inc
    self.update_attribute(:count, self.count + 1)
  end
  
  def dec
    if self.count == 1
      self.delete
    else
      self.update_attribute(:count, self.count - 1)
    end
  end
end