class AddPropertiesToTweets < ActiveRecord::Migration
  def change
    execute "ALTER TABLE tweets ADD FOREIGN KEY (hash_tag_id) REFERENCES hash_tags(id)"
    execute "ALTER TABLE tweets ADD FOREIGN KEY (ancestor_id) REFERENCES tweets(id)"
    remove_column :tweets, :related_count
    add_column :tweets, :related_count, :integer, :default => 0
    add_index "hash_tags", ["hash_tag"], :unique => true
  end
end
