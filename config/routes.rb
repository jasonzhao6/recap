TwitterClone::Application.routes.draw do

  root :to => 'tweets#index'
  resources :tweets do
    get 'reply' => 'tweets#new'
  end
  get 'quote' => 'tweets#quote'

end
