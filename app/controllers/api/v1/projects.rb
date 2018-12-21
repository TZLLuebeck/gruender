module API
  module V1
    class Projects < Grape::API
      include API::V1::Defaults
      helpers UpdateProjects

      resource :projects do

        #############
        #CREATE
        #############

        oauth2
        params do
          requires :data, type: Hash do
            requires :name, type: String
            requires :typus, type: String
            given typus: ->(val) { val != 'Open Innovation' } do
              requires :problem, type: String
            end
            requires :solution, type: String
            requires :goal, type: String
            requires :tags, type: Array[Integer]
            requires :coop, type: Boolean
            given coop: ->(val) {val == true} do
              requires :cooptext, type: String
            end
            optional :attachment, type: Rack::Multipart::UploadedFile
            optional :image, type: Rack::Multipart::UploadedFile
          end
        end
        post '' do
          create_new_draft(params)
        end

        oauth2
        params do
          requires :id, type: Integer
        end
        post 'like/:id' do
          like_project(params)
        end

        oauth2
        params do
          requires :id, type: Integer
        end
        post '/publish' do
          publish_draft(params)
        end

        oauth2
        params do
          requires :id, type: Integer
          requires :content, type: String
        end
        post '/comment/:id' do
          post_comment(params)
        end

        #################
        # READ
        #################

        oauth2
        get '' do
          return_all
        end

        get '/featured' do
          return_featured_projects()
        end

        params do
          requires :current, type: Integer
        end
        get '/more' do
          return_more_projects(params)
        end

        params do
          requires :category, type: String
        end
        get '/category' do
          get_by_category(params)
        end

        params do
          requires :id, type: Integer
        end
        get '/:id' do
          return_project(params)
        end

        #################
        # UPDATE
        #################

        oauth2
        params do
          requires :id, type: Integer
        end
        put '/unpublish' do
          unpublish_project(params)
        end

        oauth2
        params do
          requires :id, type: Integer
          optional :goal, type: String
          optional :problem, type: String
          optional :solution, type: String
          optional :kooperations, type: String
          optional :tags, type: Array
          optional :attachment, type: Rack::Multipart::UploadedFile
        end
        put '' do
          update_project(params)
        end

        oauth2
        params do
          requires :content, type: String
        end
        put '/comment/:id' do
          update_comment(params)
        end

        #################
        # DESTROY
        #################

        oauth2
        params do
          requires :id, type: String
        end
        delete '' do
          delete_project(params)
        end
      end
    end
  end
end