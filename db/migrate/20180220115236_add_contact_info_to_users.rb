class AddContactInfoToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :name, :string
    add_column :users, :web, :string
    add_column :users, :fon, :string
    add_column :users, :location, :string
  end
end
