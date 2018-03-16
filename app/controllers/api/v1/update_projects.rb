module API
  module V1
    module UpdateProjects
      extend ActiveSupport::Concern

      #############
      #CREATE
      #############

      def create_new_draft(params)
        # link the new post with the user posting it.
        params[:data].merge!(
            user_id: current_resource_owner_id,
          )
        # Extract keywords from the dataset.
        keywords = params[:data][:keywords]
        params[:data].delete :keywords
        # Make new Project
        ref = Project.new(params[:data])
        if params[:data][:guide]
          ref.typus = "Tutorial"
        else
          ref.typus = "Showcase"
        end

        if keywords
          #If there are keywords, add them to the taglist.
          keywords.each do |keyword|
              ref.tag_list.add(keyword)
          end
        end
        # Initiate the number of established contacts.
        ref.likes = 0
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

      def publish_draft(params)
        pr = Projects.find(params[:id])
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
        if pr
          pr.serializable_hash.merge(comments: pr.comments, tags: pr.communities)
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

      def return_featured_projects()
        pr = Project.order(:likes).limit(12)
        if pr
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