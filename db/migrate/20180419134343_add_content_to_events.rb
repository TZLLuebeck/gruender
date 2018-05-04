class AddContentToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :user_id, :integer
    add_column :events, :event_type, :string
    add_column :events, :trigger_id, :integer
    add_column :events, :trigger_type, :string
    add_column :events, :target_id, :integer
    add_column :events, :target_type, :string
    add_column :events, :read, :boolean
  end
end
