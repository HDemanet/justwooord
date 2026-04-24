class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: 'Connexion réussie.',
      user: {
        id: resource.id,
        email: resource.email,
        name: resource.name
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    head :ok
  end
end
