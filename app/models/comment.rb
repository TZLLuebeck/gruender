class Comment < ApplicationRecord

  belongs_to :user
  belongs_to :parent, polymorphic: true

  after_create do
    if self.parent_type == "Project"
      c = Project.find(self.parent_id)
      e = Event.new(user_id: c.user_id, trigger_id: self.id, trigger_type: "Comment", target_id: c.id, target_type: "Project" , event_type: "new_comment:project", read: false)
    else
      d = Post.find(self.parent_id)
      e = Event.new(user_id: d.user_id, trigger_id: self.id, trigger_type: "Comment", target_id: d.id, target_type: "Post", event_type: "new_comment:discussion", read: false)
    end
    e.save!
  end
end
