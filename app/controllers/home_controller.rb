class HomeController < ActionController::Base
  # Includes the environment variables to pass to the Javascript application.
  include JsEnv
  respond_to :html, :json
  protect_from_forgery with: :exception
  layout 'index'
  # Renders index.html.erb Nothing more needs to be done; the rest of the application runs through angularJS and ui-router.

  def index
    render text: '', layout: true
  end
end
