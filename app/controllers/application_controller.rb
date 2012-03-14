require 'yaml'

class ApplicationController < ActionController::Base
  protect_from_forgery
  
  helper_method :current_user
  
  protected
  
  def current_user
    @current_user ||= session[:current_user] if session[:current_user]
    @current_user ||= User.find cookies[:current_user_id] if cookies[:current_user_id]
    @current_user = nil if cookies[:current_user_key] != generate_key(@current_user)
    @current_user
  end
  
  def set_current_user user
    if user
      @current_user = session[:current_user] = user
      cookies[:current_user_id] = {value: user.id, expires: 30.days.from_now}
      cookies[:current_user_key] = {value: generate_key(user), expires: 30.days.from_now}
    else
      @current_user = session[:current_user] = nil
      cookies.delete :current_user_id
      cookies.delete :current_user_key
    end
  end
  
  def extract_first_error_message messages
    messages.map{|k, v| "#{k.to_s.capitalize.gsub(/\_/, ' ')} #{v.first}"}.first.to_s
  end
  
  private
  
  def generate_key user
    Digest::SHA1.hexdigest(user.created_at.to_s)[6,10]
  end
  
end