source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rack'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.4'
# Use mysql as the database for Active Record
gem 'mysql2', '>= 0.3.18', '< 0.5'
# Use Passenger as application server
gem "passenger", ">= 5.0.25", require: "phusion_passenger/rack_handler"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'

############## Asynch
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use Sidekiq as job handler.
# gem 'sidekiq'
# Lacking Redis, use a simpler job handler instead.
gem 'sucker_punch', '~> 2.0'
gem 'turbolinks'

############## Models
# Use rolify to handle user roles
# gem 'rolify'
# Use carrierwave for file management.
  gem 'carrierwave', '~> 1.0'


############# Client-Server-Communication
# Use Grape as connecting API.
  gem 'grape'
  gem 'grape-swagger'
# Use Kaminari for pagination
  gem 'kaminari'


############## Security
# Use Figaro to hide app variables.
  gem 'figaro'
# Use ActiveModel has_secure_password
  gem 'bcrypt', '~> 3.1.7'
# Use Devise for basic user authentication
  gem 'devise'
  gem 'devise-async'
# Use doorkeeper for OAuth2 matters
  gem 'doorkeeper', '~>4.2.5'
# Use Wine_bouncer as oauth security for grape
  gem 'wine_bouncer'
# Use hashie for sanitation.
  gem 'hashie-forbidden_attributes'
# Use cancancan to handle permissions.
  gem 'cancancan'


# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
gem 'tzinfo-data'#, platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'tzinfo'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'capistrano', '~> 3.6'
  gem 'capistrano-rails', '~> 1.3'
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
