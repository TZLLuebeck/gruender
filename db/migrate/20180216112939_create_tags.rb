class CreateTags < ActiveRecord::Migration[5.1]
  def self.up
    create_table :communities_projects, :id => false do |t|
      t.column :project_id, :integer, limit: 8
      t.column :community_id, :integer, limit: 8
    end
  end
end
