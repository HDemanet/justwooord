class ApplicationController < ActionController::API
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name daily_goal_minutes])
  end

  def current_user_response
    {
      id: current_user.id,
      email: current_user.email,
      name: current_user.name,
      daily_goal_minutes: current_user.daily_goal_minutes
    }
  end
end
