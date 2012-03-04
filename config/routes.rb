TwitterClone::Application.routes.draw do

  root :to => 'tweets#index'
  get 'quote' => 'tweets#quote'
  resources :tweets do
    get :reply
  end

end
