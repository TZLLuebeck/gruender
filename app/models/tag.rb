class Tag < ApplicationRecord

  belongs_to :projects
  belongs_to :communities
  
end
