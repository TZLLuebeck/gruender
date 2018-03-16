class Community < ApplicationRecord

has_and_belongs_to_many :projects
has_and_belongs_to_many :users
has_many :discussions, foreign_key: "community_id", class_name: "Post"
has_many :comments, through: :discussions

end
