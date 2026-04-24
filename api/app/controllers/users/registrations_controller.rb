class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: 'Compte créé.',
        user: {
          id: resource.id,
          email: resource.email,
          name: resource.name
        }
      }, status: :created
    else
      render json: {
        message: 'Erreur lors de la création du compte.',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def sign_up(resource_name, resource)
    # Ne pas connecter automatiquement après inscription en mode API
    # Le token JWT sera obtenu via POST /users/sign_in
  end
end
