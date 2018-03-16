require 'grape-swagger'

module API
  class Base < Grape::API
    # React to JSON calls only.
    content_type :json, 'application/json'
    default_format :json
    # Import Winebouncer to check authorization on the REST level.
    use ::WineBouncer::OAuth2
    mount API::V1::Base
  end
end
