class AddTypusToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :typus, :string
  end
end
