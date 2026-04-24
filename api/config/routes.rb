Rails.application.routes.draw do
  devise_for :users,
             path: 'users',
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations'
             }

    namespace :api do
      namespace :v1 do
        get 'me', to: 'users#me'
        post 'import', to: 'imports#create'
        resources :lessons, only: [:index, :create, :show, :update, :destroy]
        resources :words, only: [:index, :create, :show, :update, :destroy]
        resources :tags, only: [:index, :create, :destroy]
        resources :review_cards, only: [:index] do
          collection do
            get :due
          end
          member do
            patch :update
          end
        end
        resources :review_sessions, only: [:create, :index]
      end
    end
end
