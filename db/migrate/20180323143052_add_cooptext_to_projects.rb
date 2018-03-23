class AddCooptextToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :cooptext, :text
  end
end
