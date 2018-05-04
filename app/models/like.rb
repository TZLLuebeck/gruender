class Like < ApplicationRecord

  belongs_to :user
  belongs_to :liked_project, class_name: "Project"

end
