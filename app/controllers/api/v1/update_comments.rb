module API
  module V1
    module UpdateComments
      extend ActiveSupport::Concern

      def create_comment(params)
        c = Comments.new(params)
        u = current_resource_owner
        c[:user_id] = u.id
        c[:author] = u.username
        if c.save!
          status 200
          {status: 200, data: c}
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end

      def report_comment(params)
        r = Reports.new()
        r[:target_id] = params[:id]
        r[:target_type] = "Comment"
        r[:reason] = params[:reason]
        if r.save!
          status 200
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end

      def edit_comment(params)
        c = Comments.find(params[:id])
        if c.update!(params)
          status 200
          {status: 200, data: c}
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end

      def remove_comment(params)
        c = Comments.find(params[:id])
        if c.delete!
          status 200
          {status: 200}
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end
    end
  end
end