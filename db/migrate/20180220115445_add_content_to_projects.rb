class AddContentToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :goal, :text
    add_column :projects, :problem, :text
    add_column :projects, :solution, :longtext
    add_column :projects, :coop, :boolean
    add_column :projects, :likes, :integer
    add_column :projects, :attachment, :string
    add_column :projects, :status, :string
  end
end
