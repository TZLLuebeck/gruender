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
          requires :name, type: String
          optional :goal, type: String
        end
        post '' do
          create_new_draft(params)
        end

        oauth2
        params do
          requires :id, type: Integer
        end
        post '/publish' do
          publish_draft(params)
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