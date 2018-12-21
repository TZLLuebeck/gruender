module API
  module V1
    class Communities < Grape::API
      include API::V1::Defaults  
      helpers UpdateCommunities

      resource :communities do

        #################
        #
        # CREATE
        #
        #################

        oauth2
        params do
          requires :data, type: Hash do
            requires :name, type: String
            requires :description, type: String
          end
        end
        post '/' do
          create_new_community(params)
        end

        oauth2
        params do
          requires :id, type: Integer
          requires :data, type: Hash do
            requires :title, type: String
            requires :content, type: String
          end
        end
        post '/post/:id' do
          post_discussion(params)
        end

        oauth2
        params do
          requires :id, type: Integer
          requires :data, type: Hash do
            requires :content, type: String
          end
        end
        post '/comment/:id' do
          post_comment(params)
        end

        oauth2
        params do
          requires :id, type: Integer
        end
        post '/join/:id' do
          join_community(params)
        end

        #################
        #
        # READ
        #
        #################

        get '/' do
          return_all_communities()
        end

        get '/popular' do
          return_most_used()
        end

        params do
          requires :id, type: Integer
        end
        get '/:id' do
          return_one_community(params)
        end

        #################
        #
        # UPDATE
        #
        #################

        oauth2
        params do
          requires :id, type: Integer
          requires :data, type: Hash do
            optional :description, type: String
            optional :officials, type: Array
          end
        end
        put '/:id' do
          edit_community(params)
        end

        oauth2
        params do
          requires :content, type: String
        end
        put '/post/:id' do
          update_discussion(params)
        end

        oauth2
        params do
          requires :content, type: String
        end
        put '/comment/:id' do
          update_comment(params)
        end
        #################
        #
        # DELETE
        #
        #################

        oauth2
        params do
          requires :id, type: Integer
        end
        delete '/leave/:id' do
          leave_community(params)
        end

        oauth2
        params do
          requires :id, type: Integer
        end
        delete '/:id' do
          destroy_community(params)        
        end

      end
    end
  end
end