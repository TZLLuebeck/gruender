module API
  module V1
    class Events < Grape::API
      include API::V1::Defaults

      resource :events do
        
        oauth2
        get '/new' do
          id = current_resource_owner_id
          e = Events.find(user_id: id).count(read: false)
          status 200
          {status: 200, data: e}
        end

        oauth2
        params do
          optional :amount, type: Integer
        end
        get '/' do
          id = current_resource_owner_id
          if params[:amount]
            e = Events.find(user_id: id).order(created_at: :desc).limit(:amount)
          else
            e = Events.find(user_id: id).order(created_at: :desc)
          end
          status 200
          {status: 200, data: e}
        end
        
      end
    end
  end
end