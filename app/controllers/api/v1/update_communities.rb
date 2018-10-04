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

      def post_discussion(params)
        u = current_resource_owner
        c = Community.find(params[:id])
        d = Post.new(user_id: u.id, author: u.username, title: params[:data][:title], content: params[:data][:content])
        c.discussions << d
        if c.save!
          status 200
          {status: 200, data: d}
        else
          response = {
            description: 'Ein Fehler ist aufgetreten; Status konnte nicht geändert werden.',
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

      def post_comment(params)
        u = current_resource_owner
        d = Post.find(params[:id])
        c = Comment.new(user_id: u.id, author: u.username, content: params[:data][:content], grandparent_id: d.community_id)
        d.comments << c
        if d.save!
          status 200
          {status: 200, data: c}
        else
          response = {
            description: 'Ein Fehler ist aufgetreten; Kommentar konnte nicht gespeichert werden.',
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

      def join_community(params)
        u = current_resource_owner
        if Ability.new(u).can(:joinleave, Community)
          if c = Community.find(params[:id])
            c.users << u
            status 200
            {status: 200, data: true}
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

      def return_all_communities()
        c = Community.all().select(:id, :name, :icon, :typus)
        if c
          status 200
          {status: 200, data: c}
        else
          response = {
            description: 'Es konnte keine Communities gefunden werden.',
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
      end

      def return_one_community(params)
        u = current_resource_owner
        if Ability.new(u).can(:read, Community)
          c = Community.find(params[:id])
          members = c.users
          projects = c.projects
          member_count = 0
          if members
            member_count = members.count
          end
          project_count = 0
          if projects
            project_count = projects.count
          end
          subscribed = false
          if u
            subscribed = u.is_member?(c.id)
          end
          discussions = c.discussions
          if discussions
            discussions = discussions.map { |e| e.serializable_hash.merge(comments: e.comments) }
          end
          p discussions
          c = c.serializable_hash.merge(subscribed: subscribed).merge(members: members).merge(projects: projects).merge(member_count: member_count).merge(project_count: project_count).merge(discussions: discussions)
          p c
          status 200
          {status: 200, data: c}
        else
          response = default_forbidden()
          error!(response, 403)
        end
      end  

      def return_most_used()
        mu = Community.left_joins(:communities_projects).group(:id).order('COUNT(communities_projects.community_id) DESC').limit(8)
        if mu
          status 200
          {status: 200, data: mu}
        else
          response = {
            description: 'Es konnten keine Communities gefunden werden.',
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
      end    

      def get_members(params)
        c = Community.find(params[:id])
        m = c.users

        status 200
        {status: 200, data: m}
      end


      def leave_community(params)
        id = params[:id]
        u = current_resource_owner
        c = Community.find(id)
        if u.is_member?(id)
          if c.users.delete(u.id)
            status 200
            {status: 200, data: false}
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
        else
          status 200
          {status: 200, data: false}
        end
      end
    end
  end
end