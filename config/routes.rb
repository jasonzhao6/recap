TwitterClone::Application.routes.draw do

  root :to => 'tweets#index'
  resources :tweets
  get '/quote' => 'tweets#quote'

end
