class Message < ApplicationRecord

  belongs_to :sender, class_name: "User"
  belongs_to :recipient, class_name: "User"



  after_create do
    e = Event.new(user_id: self.recipient_id, trigger_id: self.id, trigger_type: "Message", target_id: self.sender_id, target_type: "User", event_type: "new_private_message", read: false)
  end
end
