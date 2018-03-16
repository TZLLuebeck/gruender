class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable

  has_many :access_grants, class_name: "Doorkeeper::AccessGrant", foreign_key: :resource_owner_id, dependent: :delete_all # or :destroy if you need callbacks
  has_many :access_tokens, class_name: "Doorkeeper::AccessToken", foreign_key: :resource_owner_id, dependent: :delete_all # or :destroy if you need callbacks
  has_many :projects
  has_and_belongs_to_many :communities
  has_many :posts
  has_many :comments
  
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
