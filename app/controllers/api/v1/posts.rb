module API
  module V1
    class Posts < Grape::API
      include API::V1::Defaults
      helpers UpdatePosts

      resource :posts do

        #################
        # CREATE
        #################

        params do
          requires :community_id, type: Integer
          requires :title, type: String
          requires :content, type: String
        end
        post '' do
          create_post(params)          
        end

        params do
          requires :id, type: Integer
          requires :reason, type: String
        end
        post '/report' do
          report_post(params)
        end

        ################
        # UPDATE
        ################

        params do
          requires :id, type: Integer
          requires :content, type: String
        end
        put '' do
          edit_post(params)
        end

        ################
        # DELETE
        ################

        params do
          requires :id, type: Integer
        end
        delete '' do
          remove_post(params)
        end
      end
    end
  end
end