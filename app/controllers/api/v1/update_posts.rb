module API
  module V1
    module UpdatePosts
      extend ActiveSupport::Concern

      def create_post(params)
        p = Post.new(params)
        u = current_resource_owner
        p[:user_id] = u.id
        p[:author] = u.username
        if p.save!
          status 200
          {status: 200, data: p}
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end

      def report_post(params)
        r = Reports.new()
        r[:target_id] = params[:id]
        r[:target_type] = "Post"
        r[:reason] = params[:reason]
        if r.save!
          status 200
          {status: 200}
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end

      def edit_post(params)
        p = Post.find(params[:id])
        if p.update!(params)
          status 200
          {status: 200, data: p}
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end

      def remove_post(params)
        p = Post.find(params[:id])
        if p.delete!
          status 200
          {status: 200}
        else
          # ENTER 500 ERROR MESSAGE HERE
        end
      end
    end
  end
end