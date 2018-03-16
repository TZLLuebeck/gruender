module API
  module V1
    class Comments < Grape::API
      include API::V1::Defaults  
      helpers UpdateComments

      resource :comments do
        ####################
        # => CREATE
        ####################
        oauth2
        params do
          requires :parent_id, type: Integer
          requires :parent_type, type: String
          requires :title, type: String
          requires :content, type: String
        end
        post '' do
          create_comment(params)
        end

        oauth2
        params do
          requires :id, type: Integer
          requires :reason, type: Integer
        end
        post 'report' do
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