import jwt from "jsonwebtoken";
import AbstractListener from "../../../Framework/AbstractListener";

class SendPasswordResetLink extends AbstractListener {
  static LISTEN_ON = [
    "EVENT_ACTION_PASSWORD_RESET_REQUEST_POST",
  ];

  async handle(user) {
    const config = this.getApplication().getConfiguration();
    const resetToken = user.passResetToken;

    const token = jwt.sign({ email: user.email }, config.jwt.secret);

    // Make a call to the Mailgun service endpoint to send the email
    try {
      let resetUrl = `${config.frontend.host}${config.frontend.passwordResetUri}?token=${resetToken}`;

      if (user.role === "admin") {
        resetUrl = `${config.admin.host}${config.frontend.passwordResetUri}?token=${resetToken}`;
      }

      await this.getApplication()
        .externalHttpRequest(
          "POST",
          `${config.api.host}/api/v1/mailgun/send-email`,
          {
            data: {
              template: "passwordResetRequest",
              emailMeta: {
                subject: "Password reset link",
                fromName: config.contact.name,
                from: config.contact.email,
                toName: `${user.firstName} ${user.lastName}`,
                to: user.email
              },
              data: {
                user,
                url: resetUrl
              }
            },
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );
    } catch (sendEmailError) {
      this.getApplication()
        .logError("Error sending password reset email: %O", sendEmailError);
    }
  }
}

export default SendPasswordResetLink;
