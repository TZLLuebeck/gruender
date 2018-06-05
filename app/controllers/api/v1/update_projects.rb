module API
  module V1
    module UpdateProjects
      extend ActiveSupport::Concern
      require 'sanitize'

      #############
      #CREATE
      #############

      def create_new_draft(params)
        # link the new post with the user posting it.
        u = current_resource_owner
        params[:data].merge!(
            user_id: u.id,
          )
        # Extract keywords from the dataset.
        tags = params[:data][:tags]
        params[:data].delete :tags
        # Make new Project
        params[:data][:solution] = Sanitize.fragment(params[:data][:solution], elements: ['p', 'blockquote', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'img', 'ul', 'ol', 'li', 'img'], attributes: {'span' => ['style'], 'img' => ['style', 'src']}, css: {properties: ['color', 'font-family', 'background-color', 'width', 'height']})
        ref = Project.new(params[:data])

        if tags
          #If there are keywords, add them to the taglist.
          tags.each do |community_id|
              ref.communities << Community.find(community_id)
          end
        end
        if ref.save 
          status 200
          {status: 200, data: ref}
        else
          response = {
            description: 'Der Eintrag konnte nicht gespeichert werden.',
            error: {
              name: 'could_not_create',
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

      def like_project(params)
        pr = Project.find(params[:id])
        if pr
          pr.likes << current_resource_owner 
          pr.save!
          status 200
          {status: 200, data: true}
        else
          response = {
            description: 'Es konnte kein passendes Projekt gefunden werden.',
            error: {
              name: 'no_such_project',
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

      def post_comment(params)
        pr = Project.find(params[:id])
        u = current_resource_owner
        c = Comment.new({user_id: u.id, author:u.username, content: params[:content]})
        pr.comments << c
        if pr.save!
          status 200
          {status: 200, data: c}
        else
          response = {
              description: 'Der Eintrag konnte nicht gespeichert werden.',
              error: {
                name: 'could_not_update',
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

      def publish_draft(params)
        pr = Project.find(params[:id])
        valid = true
        # VALIDATION REQUIRED
        if valid
          pr[:status] = "Published"
          if pr.save!
            status 200
            {status: 200, data: pr}
          else
            response = {
              description: 'Der Eintrag konnte nicht gespeichert werden.',
              error: {
                name: 'could_not_update',
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
            description: 'Es konnte kein passendes Projekt gefunden werden.',
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

      def report_project(params)
        r = Reports.new()
        r[:target_id] = params[:id]
        r[:target_type] = "Project"
        r[:reason] = params[:reason]
        if r.save!
          status 200
          {status: 200}
        else
          response = {
            description: 'Der Eintrag konnte nicht gespeichert werden.',
            error: {
              name: 'could_not_create',
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

      def return_all
        pr = Projects.all
        
        status 200
        {status: 200, data: pr}
      end

      def return_project(params)
        pr = Project.find(params[:id])
        a = User.find(pr.user_id)
        c = pr.comments
        author = {name: a.username, url: a.web}
        if pr
          res = pr.serializable_hash.merge(comments: c, tags: pr.communities, author: author, likes: pr.likes)
          status 200
          {status: 200, data: res}
        else
          response = {
            description: 'Es konnte kein passendes Projekt gefunden werden.',
            error: {
              name: 'no_such_project',
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

      def return_featured_projects()
        pr = Project.order(likes: :desc).limit(12)
        if pr
          status 200
          {status: 200, data: pr}
        else
          response = {
            description: 'Es konnte kein passendes Projekt gefunden werden.',
            error: {
              name: 'no_such_project',
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

      def return_more_projects(params)
        cur = Project.find(params[:current])

        similar = Project.where(typus: cur[:typus]).where.not(id: cur[:id]).order("RAND()").limit(3)
        other = Project.where.not(typus: cur[:typus]).order("RAND()").limit(1)
        if similar || other
          status 200
          data = {similar: similar, other: other}
          {status: 200, data: data}
        else
          response = {
            description: 'Es konnte kein passendes Projekt gefunden werden.',
            error: {
              name: 'no_such_project',
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

      def get_by_category(params)
        category = params[:category]
        pr = Project.where(typus: category)
        if pr
          status 200
          {status: 200, data: pr}
        else
          response = {
            description: 'Es konnte kein passendes Projekt gefunden werden.',
            error: {
              name: 'no_such_project',
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

      def unpublish_project(params)
        pr = Projects.find(params[:id])
        pr[:status] = "Draft"
        if pr.save!
          status 200
          {status: 200, data: pr}
        else
          response = {
            description: 'Der Eintrag konnte nicht bearbeitet werden.',
            error: {
              name: 'could_not_update',
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

      def update_project(params)
        pr = Projects.find(params[:id])
        pr.update_attributes(params)
        if pr.save!
          status 200
          {status: 200, data: pr}
        else
          response = {
            description: 'Der Eintrag konnte nicht bearbeitet werden.',
            error: {
              name: 'could_not_update',
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

      def delete_project(params)
        pr = Projects.find(params[:id])
        if pr.destroy!
          status 200
          {status: 200}
        else
          response = {
            description: 'Der Eintrag konnte nicht gelöscht werden.',
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
      end
    end
  end
end