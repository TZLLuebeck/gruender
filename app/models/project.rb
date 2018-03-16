class Project < ApplicationRecord

belongs_to :user
has_many :comments, as: :parent
has_and_belongs_to_many :communities

mount_uploader :attachment, AttachmentUploader


end
