module API
  module V1
    class Comments < Grape::API
      include API::V1::Defaults  
      helpers UpdateComments

      resource :comments do
        oauth2
        params do
          requires :data, type: Hash do
            requires :id, type: Integer
            requires :reason, type: String
          end
        end
        post '/report' do
          report_comment(params)
        end

        ####################
        # => UPDATE
        ####################

        oauth2
        params do
          requires :id, type: Integer
          requires :content, type: String
        end
        put '' do
          edit_comment(params)
        end

        ####################
        # => DELETE
        ####################
        oauth2
        params do
          requires :id, type: Integer
        end
        delete '' do
          remove_comment(params)
        end
      end
    end
  end
end