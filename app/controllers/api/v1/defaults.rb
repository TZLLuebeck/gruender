module API
  module V1
    module Defaults
      extend ActiveSupport::Concern

      # Some basic functions and escapes called from any grape path.

      included do
        version 'v1'
        format :json

        helpers do
          # Identify the OAuth2 token from its code sent from the requestee. 
          def current_token
            Doorkeeper::AccessToken.find_by token: bearer_token
          end

          # Returns cleaned Oauth2 token code from query header.
          def bearer_token
            pattern = /^Bearer /
            header  = request.headers['Authorization']
            header.gsub(pattern, '') if header && header.match(pattern)
          end

          def warden
            env['warden']
          end

          # find user corresponding to the sent token
          def current_resource_owner
            User.find(current_token.resource_owner_id) if current_token
          end
          alias_method :current_user, :current_resource_owner

          # return the id of the token's owner
          def current_resource_owner_id
            current_token.resource_owner_id if current_token
          end
        end

        ##########################
        # Exception Handling
        # Exception handlers are checked in order bottom-up.
        ##########################

        # Any exception not caught by the other handlers below or handled within the code will be caught here.
        # It spits out a generic 500 Internal Server Error. Something actually went wrong.

        rescue_from :all do |e|
          if Rails.env.development?
            puts 'Rescue Team to the Rescue!'
            fail e
          else
            puts e
            error_response(message: 'Internal server error', status: 500)
          end
        end

        # This handler catches the exception spit out by Grape's data
        # validation when a data point is missing when expected or has a wrong value. 
        # It returns a 400 HTML error, indicating that the input was not as expected.
        rescue_from Grape::Exceptions::ValidationErrors do |e|
          response = {
            status: 400,
            error: e
          }
          error!(response, 400)
        end

        # This handler catches the exception spit out by Wincebouncer
        # whenever a user without a valid Oauth2 token attempts to access
        # a resource that is protected by it. It returns a 401 Unauthorized HTML
        # error.
        rescue_from WineBouncer::Errors::OAuthUnauthorizedError do |e|
          response = {
            status: 401,
            error: e.response
          }
          error!(response, 401)
        end
      end
    end
  end
end
