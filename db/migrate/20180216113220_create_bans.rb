class CreateBans < ActiveRecord::Migration[5.1]
  def change
    create_table :bans do |t|
      t.integer :target_id
      t.string :reason
      t.date :end

      t.timestamps
    end
  end
end
