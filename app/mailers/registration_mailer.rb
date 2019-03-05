class RegistrationMailer < ActionMailer::Base
  default from: 'info@gruenderviertel.de'

  def welcome_email(user)
    @user = user
    @name = @user.username
    mail(to: @user.email, subject: 'Willkommen im Gründerviertel')
  end

end
