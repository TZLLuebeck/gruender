module API
  module V1
    module UpdateUsers
      extend  ActiveSupport::Concern


      # This file manages the database interactions regarding the User model.


      # CREATE


      # A new User object has been posted to the server.
      def create_user(params)
        params.delete :format
        # Check if an account with that username or email already exists. 
        # If so, throw an error message back.
        if User.find_by(username: params[:data][:username])
          response = {
            description: 'Der angegebene Benutzername existiert bereits.',
            error: {
              name: 'username_exists',
              state: 'conflict'
              },
            reason: 'unknown',
            redirect_uri: nil,
            response_on_fragment: nil,
            status: 409
          }
          error!(response, 409)
        else
          if User.find_by(email: params[:data][:email])
          response = {
            description: 'Die angegebene Email existiert bereits.',
            error: {
              name: 'email_exists',
              state: 'conflict'
              },
            reason: 'unknown',
            redirect_uri: nil,
            response_on_fragment: nil,
            status: 409
          }
          error!(response, 409)
          else 
            par = params[:data]
            subs = par[:subscriptions]
            par.delete :subscriptions

            # create the User in the database
            u = User.new(par)

            p subs
            subs.each do |index, community_id|
              p community_id
              u.communities << Community.find(community_id)
            end



            if u.save
              # Create an initial AccessToken to remember the user by and return the token and the user object, so the User is directly logged in.
              token = Doorkeeper::AccessToken.create!(
                application_id: ENV['APPLICATION_ID'],
                resource_owner_id: u.id,
                scopes: 'all',
                expires_in: Doorkeeper.configuration.access_token_expires_in,
                use_refresh_token: Doorkeeper.configuration.refresh_token_enabled?
              )
              ret = {
                user: u,
                token: {
                  access_token: token.token,
                  refresh_token: token.refresh_token,
                  expires_in: token.expires_in
                }
              }
              # Send Welcoming Mail.
              #WelcomeMailer.welcome_email(u).deliver_later
              #WelcomeMailWorker.perform_async(u)
              status 200
              { status: 200, data: ret}
            else
              # If the param validation worked, but the save failed, there was some internal error.
              response = {
                description: 'Die Registrierung ist fehlgeschlagen.',
                error: {
                  name: 'could_not_save',
                  state: 'internal_server_error'
                  },
                reason: 'unknown',
                redirect_uri: nil,
                response_on_fragment: nil,
                status: 500
                }
              error!(response, 500)
            end
          end
        end
      end

 

      # A user attempts to log in with a username and password.
      def login(params)
        u = User.where(username: params[:data][:username]).first
        # Check if an account with that username exists. If not, return error.
        if u
          # Check if the password is valid. If not, return error.
          if u.valid_password?(params[:data][:password])
            # Check if account has any current suspensions running.
            today = Date.today
            #b = Bans.where(target_id: u.id).where(:end > today)
            #if b
            if false
              response = {
                description: 'Ihr Account wurde bis zum '+b.end+' suspendiert.',
                error: {
                  name: 'banned',
                  state: 'unauthorized'
                  },
                reason: b.reason,
                redirect_uri: nil,
                response_on_fragment: nil,
                status: 403
              }
              error!(response, 403)
            else
              # If the password is correct, create and return an AccessToken so the User is logged in.
              token = Doorkeeper::AccessToken.create!(
                application_id: ENV['APPLICATION_ID'],
                resource_owner_id: u.id,
                scopes: 'all',
                expires_in: Doorkeeper.configuration.access_token_expires_in,
                use_refresh_token: Doorkeeper.configuration.refresh_token_enabled?
              )
              ret = {
                user: u,
                token: {
                  access_token: token.token,
                  refresh_token: token.refresh_token,
                  expires_in: token.expires_in
                }
              }
              status 200
              { status: 200, data: ret}
            end
          else
            response = {
              description: 'Das eingegebene Passwort war falsch.',
              error: {
                name: 'wrong_password',
                state: 'unauthorized'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 403
            }
            error!(response, 403)
          end
        else
          response = {
              description: 'Dieser Accountname existiert nicht.',
              error: {
                name: 'username_not_found',
                state: 'not_found'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 404
          }
          error!(response, 404)
        end
      end

      
      # READ

      def get_users(params)
        # Check if the user making the request has the rights to view this resource.
        if Ability.new(current_resource_owner).can?(:read, User)
          # Return all Users except the one making the request and attach their account type to the object.
          res = User.where.not(id: current_resource_owner_id)
          if res
            status 200
            { status: 200, data: res.serializable_hash.merge(projects: user.projects, discussions: user.discussions, comments: user.comments) }
          else
            response = {
              description: 'Es wurden keine anderen Nutzer gefunden.',
              error: {
                name: 'no_users',
                state: 'not_found'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 404
            }
            error!(response, 404)
          end
        else
         response = {
            description: 'Sie haben nicht die nötigen Rechte, um diese Aktion durchzuführen.',
            error: {
              name: 'no_ability',
              state: 'forbidden'
              },
            reason: 'unknown',
            redirect_uri: nil,
            response_on_fragment: nil,
            status: 403
          }
          error!(response, 403)
        end
      end

      def get_all(params)
        # Return all users, including the one making the request.
        if Ability.new(current_resource_owner).can?(:read, User)
          res = User.all.map do |u|
            #Add their account type, as well as the amount of attached posts.
            u.serializable_hash.merge(post_count: u.projects.count)
          end
          if res
            status 200
            { status: 200, data: res }
          else
            response = {
              description: 'Es konnten keine Nutzer gefunden werden.',
              error: {
                name: 'no_users',
                state: 'not_found'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 404
            }
            error!(response, 404)
          end
        else
          response = {
              description: 'Sie haben nicht die nötigen Rechte, um diese Aktion durchzuführen.',
              error: {
                name: 'no_ability',
                state: 'forbidden'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 403
          }
          error!(response, 403)
        end
      end

      def return_user(params)
      # Return a specific User by ID, or return the user making the request if ID param is 'me'.
        u = (id = params[:id]) == 'me' ? current_resource_owner : User.find(id)
        # Check if User making the request can read this resource.
        if Ability.new(current_resource_owner).can?(:read, u)
          if res = u.serializable_hash.merge(projects: u.projects, posts: u.posts, comments: u.comments)
            status 200
            { status: 200, data: res }
          else
            response = {
              description: 'Der Nutzer konnte nicht gefunden werden.',
              error: {
                name: 'user_not_found',
                state: 'not_found'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 404
            }
            error!(response, 404)
          end
        else
          response = {
              description: 'Sie haben nicht die nötigen Rechte, um diese Aktion durchzuführen.',
              error: {
                name: 'no_ability',
                state: 'forbidden'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 403
          }
          error!(response, 403)
        end
      end

       # UPDATE

      def update_user(params)
        params[:data].delete :roles
        # Find user with the given ID.
        u = User.find(params[:data][:id])
        # Gheck if the password is correct.
        if u.valid_password?(params[:data][:current_password])
          # Check if they have the ability to update this resource.
          if Ability.new(current_resource_owner).can?(:update, u)
            # Update the resource with the given params.
            if u.update_with_password(params[:data])
              status 200
              { status: 200, message: 'ok', data: u }
            else
              # If the param object passes validation, but still fails to save, there is an error in the server.
              response = {
                description: 'Das Update ist fehlgeschlagen.',
                error: {
                  name: 'could_not_save',
                  state: 'internal_server_error'
                  },
                reason: 'unknown',
                redirect_uri: nil,
                response_on_fragment: nil,
                status: 500
              }
              error!(response, 500)
            end
          else
            response = {
              description: 'Sie haben nicht die nötigen Rechte, um diese Aktion durchzuführen.',
              error: {
                name: 'no_ability',
                state: 'forbidden'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 403
            }
            error!(response, 403)
          end
        else
          response = {
            description: 'Das eingegebene Passwort war falsch.',
            error: {
              name: 'wrong_password',
              state: 'forbidden'
              },
            reason: 'unknown',
            redirect_uri: nil,
            response_on_fragment: nil,
            status: 403
          }
          error!(response, 403)
        end
      end

      def reset_password(params)
        # Find the user, generate a random password and send it to the account's given email.
        if u = User.find_by(username: params[:data])
          generated_password = Devise.friendly_token.first(15)
          if u.update({password: generated_password, password_confirmation: generated_password})
            PasswordMailer.reset_password_email(u, generated_password).deliver_later
          end
        else
          response = {
            description: 'Es wurde kein Account mit diesem Namen gefunden.',
            error: {
              name: 'wrong_username',
              state: 'not_found'
              },
            reason: 'unknown',
            redirect_uri: nil,
            response_on_fragment: nil,
            status: 404
          }
          error!(response, 404)
        end
      end

      # DESTROY

      def destroy_user(params)
        # Find user.
        u = User.find(params[:id]) 
        # Check if User making the request has the rights to update this resource.
        if Ability.new(current_resource_owner).can?(:delete, u)
          # Destroy the database object.
          if u.destroy
            status 200
            { status: 200, message: 'ok' }
          else
            response = {
              description: 'Löschen ist fehlgeschlagen.',
              error: {
                name: 'could_not_delete',
                state: 'internal_server_error'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 500
            }
            error!(response, 500)
          end
        else
          response = {
              description: 'Sie haben nicht die nötigen Rechte, um diese Aktion durchzuführen.',
              error: {
                name: 'no_ability',
                state: 'forbidden'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 403
          }
          error!(response, 403)
        end
      end
    end
  end
end