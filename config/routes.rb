TwitterClone::Application.routes.draw do

  root :to => 'tweets#index'
  resources :tweets do
    get 'reply' => 'tweets#new', defaults: {reply_mode: true}
  end
  get 'quote' => 'tweets#quote'

end
