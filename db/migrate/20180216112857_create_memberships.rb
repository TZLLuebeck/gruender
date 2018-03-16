class CreateMemberships < ActiveRecord::Migration[5.1]
  def self.up
    create_table :communities_users, :id => false do |t|
      t.column :user_id, :integer, limit: 8
      t.column :community_id, :integer, limit: 8
    end
  end
end
