module Api
  module V1
    class UsersController < BaseController
      def me
        render json: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          daily_goal_minutes: current_user.daily_goal_minutes
        }
      end
    end
  end
end
