class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable

  has_many :access_grants, class_name: "Doorkeeper::AccessGrant", foreign_key: :resource_owner_id, dependent: :delete_all # or :destroy if you need callbacks
  has_many :access_tokens, class_name: "Doorkeeper::AccessToken", foreign_key: :resource_owner_id, dependent: :delete_all # or :destroy if you need callbacks
  
  #Memberships to Communities
  has_and_belongs_to_many :communities
  #Ownership of Project
  has_many :projects, dependent: :delete_all
  has_many :posts, dependent: :nullify
  has_many :comments, dependent: :nullify
  has_many :sent_messages, class_name: "Message", foreign_key: "sender_id", dependent: :nullify
  #Directed at User
  has_many :events, dependent: :delete_all
  has_many :received_messages, class_name: "Message", foreign_key: "recipient_id", dependent: :nullify

  has_many :likes
  has_many :liked_projects, through: :likes, source: :project
  
  mount_uploader :logo, LogoUploader

  def is_member?(community_id)
    Mysql2::Client.default_query_options.merge!(symbolize_keys: :true, as: :hash)
    sql = "SELECT communities_users.* FROM communities_users WHERE community_id = "+community_id.to_s+" AND user_id = "+self.id.to_s
    c = ActiveRecord::Base.connection.execute(sql).to_h
    if c.empty?
      return false
    else
      return true
    end
  end  
end
