TwitterClone::Application.routes.draw do

  root :to => 'tweets#index'
  get 'quote' => 'tweets#quote_via_ajax'
  get 'search' => 'tweets#search_via_ajax'
  resources :tweets do
    get :reply
  end

end
