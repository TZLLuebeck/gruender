class AddContentToCommunities < ActiveRecord::Migration[5.1]
  def change
    add_column :communities, :description, :text
    add_column :communities, :icon, :string
    add_column :communities, :typus, :string
    
  end
end
