module API
  module V1
    class Admin < Grape::API
      include API::V1::Defaults
      helpers AdminCommands

      resource :admin do
                
        
      end
    end
  end
end