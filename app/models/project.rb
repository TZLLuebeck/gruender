class Project < ApplicationRecord

belongs_to :user
has_many :comments, as: :parent
has_and_belongs_to_many :communities
has_many :likes

mount_uploader :attachment, AttachmentUploader
mount_uploader :image, LogoUploader

end
