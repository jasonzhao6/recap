require 'yaml'

class ApplicationController < ActionController::Base
  protect_from_forgery
  
  protected
  
  def current_user
    @current_user ||= session[:current_user] if session[:current_user]
    @current_user ||= User.find cookies[:current_user] if cookies[:current_user]
    @current_user
  end
  
  def set_current_user user
    @current_user = session[:current_user] = user
    cookies[:current_user_id] = user.try(:id)
  end
  
end