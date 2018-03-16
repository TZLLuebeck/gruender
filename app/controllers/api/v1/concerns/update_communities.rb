module API
  module V1
    module UpdateCommunities
      extend  ActiveSupport::Concern

      def default_forbidden
        response = {
          description: 'Der Account hat nicht die nötigen Privilegien, um diese Aktion durchzuführen.',
          error: {
            name: 'wrong_privileges',
            state: 'forbidden'
            },
          reason: 'unknown',
          redirect_uri: nil,
          response_on_fragment: nil,
          status: 403
        }
        return response
      end



      def create_community(params)
        if Ability.new(current_resource_owner).can(:create, Community)
          if Communities.find(name: params[:name]).exists?
            response = {
              description: 'Eine Community mit diesem Namen existiert bereits.',
              error: {
                name: 'community_exists',
                state: 'conflict'
                },
              reason: 'unknown',
              redirect_uri: nil,
              response_on_fragment: nil,
              status: 409
            }
            error!(response, 409)
          else
            c = Communities.new(params)
            c.save!
          end
        else
          response = default_forbidden()
          error!(response, 403)
        end
      end

      def create_communities_from_keywords(params)
        if Ability.new(current_resource_owner).can(:create, Community)
          keywords = Tags.all()
          keywords.each do |k|
            p = {}
            p[:name] = k.name
            create_community(p)
          end
        end
      end

      def join_community(params)
        u = current_resource_owner
        if Ability.new(u).can(:joinleave, Community)
          if c = Communities.find(params[:id])
            m = Memberships.new({user_id: u.id, community_id: c.id})
            m.save!
            status 200
            {status: 200}
          else
            response = {
              description: 'Es konnte keine Community mit dieser ID gefunden werden.',
              error: {
                name: 'no_such_community',
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

        end
      end

      def get_community(params)
        u = current_resource_owner
        if Ability.new(u).can(:read, Community)
          c = Communities.find(params[:id])
          subscribed = u.is_member?(c.id)
          c.serializable_hash.merge(subscribed: subscribed, memberships: c.members)
          status 200
          {status: 200, data: c}
        else
          response = default_forbidden()
          error!(response, 403)
        end
      end      

      def get_members(params)
        c = Communities.find(params[:id])
        m = c.members

        status 200
        {status: 200, data: m}
      end


      def leave_community(params)
        id = params[community_id]
        u = current_resource_owner
        if u.is_member?(id)
          if Memberships.where(user_id == u.id).where(community_id == id).destroy
            status 200
            {status: 200}
          else
            response = {
              description: 'Ein Fehler ist aufgetreten; Status konnte nicht geändert werden.',
              error: {
                name: 'could_not_destroy',
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
  end
end