class CreateReports < ActiveRecord::Migration[5.1]
  def change
    create_table :reports do |t|
      t.integer :target_id
      t.integer :target_model
      t.string :reason

      t.timestamps
    end
  end
end
