require 'yaml'

class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authenticate
  
  protected
  
  def authenticate
    if BASIC_AUTH
      authenticate_or_request_with_http_basic do |username, password|
        username == BASIC_AUTH['username'] && password == BASIC_AUTH['password']
      end
    end
  end
  
end