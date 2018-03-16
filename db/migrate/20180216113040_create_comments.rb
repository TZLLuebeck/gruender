class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.string :title
      t.text :content
      t.integer :user_id
      t.integer :parent_id
      t.string :parent_type

      t.timestamps
    end
  end
end
