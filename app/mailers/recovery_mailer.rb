class RecoveryMailer < ActionMailer::Base
  default from: 'info@gruenderviertel.de'

  def reset_password_email(user, new_password)
    @user = user
    @pw = new_password
    mail(to: @user.email, subject: 'Ihr Passwort wurde zurückgesetzt.')
  end

end
