class SessionsController < ApplicationController
  before_filter :set_current_user_to_null # if the user is doing anything related to session, log user out first
  
  def actually_login
    user = User.find_by_email params[:email]
    if !user
      render status: 400, inline: 'Email not fount' and return
    elsif user.password != params[:password]
      render status: 400, inline: 'Incorrect password' and return
    else
      set_current_user user
      render status: 200, nothing: true
    end
  end
  
  def logout
    redirect_to login_path
  end
  
  private
  
  def set_current_user_to_null
    set_current_user nil
  end
end