module API
  module V1
    class Users < Grape::API
      include API::V1::Defaults  
      helpers UpdateUsers
      helpers Devise::Controllers::SignInOut 

      helpers do
        # Revokes the current token in the database
        def revoke
          # The authorization server first validates the client credentials
          if current_token && current_token.accessible?
            revoke_token(current_token)
          end
        end

        def revoke_token(token)
          if token
            token.revoke
            true
          else
            false
          end
        end
      end

      resource :users do
        ##################
        #
        # => Create
        #    new user
        #    login
        #
        ##################

        desc 'Creates a normal user account'
        params do
          requires :data, type: Hash do
            requires :username, type: String
            requires :email, type: String
            requires :password, type: String
            requires :password_confirmation, type: String
            requires :name, type: String
            requires :location, type: String
            optional :web, type: String
            requires :description, type: String
            requires :subscriptions, type: Array[Integer]
            optional :logo, type: Rack::Multipart::UploadedFile            
            optional :fon, type: String
          end
        end
        post '/' do
          create_user(params)
        end

        desc 'Login Process'
        params do
          requires :data, type: Hash do
            requires :username, type: String, allow_blank: false
            requires :password, type: String, allow_blank: false
          end
        end
        post '/login' do
          login(params)
        end

        params do
          requires :data, type: Hash do
            requires :receiver, type: String, allow_blank: false
            requires :content, type: String, allow_blank: false
          end
        end

        oauth2
        post '/pm' do
          write_message(params)
        end


        ##################
        #
        # => READ
        #    get users
        #    get user
        #
        ##################

        desc 'Return all users'
        oauth2
        get '/' do
          get_all(params)
        end

        desc 'Return one user'
        oauth2
        get '/:id' do
          return_user(params)
        end

        ##################
        #
        # => UPDATE
        #    edit profile
        #    reset password
        #
        ##################

        params do
        end
        desc 'Update user'
        oauth2
        params do
          requires :data, type: Hash do
            requires :id, type: Integer
            requires :current_password, type: String
            optional :password, type: String
            given :password do
              requires :password_confirmation, type: String
            end
            optional :location, type: String
            optional :description, type: String
            optional :logo, type: Rack::Multipart::UploadedFile
            optional :fon, type: String
            optional :web, type: String
          end
        end
        put '/' do
          update_user(params)
        end

        params do
          requires :email, type: String
        end
        post '/reset' do
          reset_password(params)
        end

        ##################
        #
        # => DESTROY
        #    logout
        #    delete user
        #
        ##################

        desc 'Logout'
        oauth2
        delete '/logout' do
          sign_out current_resource_owner
          revoke && warden.logout
        end

        desc 'Deletes a user, requiring that users password'
        oauth2
        params do
          requires :id, type: Integer, desc: 'user id'
          requires :current_password, type: String
        end
        delete '/:id' do
          destroy_user(params)
        end
      end
    end
  end
end
