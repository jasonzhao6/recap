TwitterClone::Application.routes.draw do

  post '/' => 'tweets#create'
  root :to => 'tweets#index'
  get '/new' => 'tweets#new'

end
