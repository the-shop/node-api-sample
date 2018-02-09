import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { propTypes, reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import compose from "recompose/compose";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { Card, CardActions } from "material-ui/Card";
import Avatar from "material-ui/Avatar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import LockIcon from "material-ui/svg-icons/action/lock-outline";
import { cyan500, pinkA200 } from "material-ui/styles/colors";

import { Notification, translate, showNotification } from "admin-on-rest";

import customTheme from "../customTheme";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    minWidth: 300,
  },
  avatar: {
    margin: "1em",
    textAlign: "center ",
  },
  form: {
    padding: "0 1em 1em 1em",
  },
  input: {
    display: "flex",
  },
  or: {
    width: "100%",
    textAlign: "center",
    display: "block"
  }
};

function getColorsFromTheme(theme) {
  if (!theme) return { primary2Color: cyan500, accent1Color: pinkA200 };
  const {
    palette: {
      primary2Color,
      accent1Color,
    },
  } = theme;
  return { primary2Color, accent1Color };
}

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) => //eslint-disable-line
  <TextField
    errorText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />;

class PasswordResetRequest extends Component {

  passwordResetRequest = ({ email }) => {
    const { showNotification } = this.props;

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/api/v1/password-reset-request",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          email
        })
      }
    ).then((response) => response.json())
      .then((response) => {
        if (!response.error) {
          showNotification("aor.notification.passwordEmailConfirmation");
          this.props.history.push("/login");
        } else {
          showNotification(response.errors.join(","), "warning");
        }
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line
      });
  };

  render() {
    const { handleSubmit, submitting, translate } = this.props;
    const muiTheme = getMuiTheme(customTheme);
    const { primary2Color, accent1Color } = getColorsFromTheme(muiTheme);
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{ ...styles.main, backgroundColor: primary2Color }}>
          <Card style={styles.card}>
            <div style={styles.avatar}>
              <Avatar backgroundColor={accent1Color} icon={<LockIcon />} size={60} />
            </div>
            <form onSubmit={handleSubmit(this.passwordResetRequest)}>
              <div style={styles.form}>
                <div style={styles.input} >
                  <Field
                    name="email"
                    component={renderInput}
                    floatingLabelText={translate("aor.auth.email")}
                  />
                </div>
              </div>
              <CardActions>
                <RaisedButton
                  type="submit"
                  primary
                  disabled={submitting}
                  label={translate("aor.auth.sendPasswordResetLink")}
                  fullWidth
                />
                <p style={styles.or}>or</p>
                <RaisedButton
                  secondary
                  onClick={() => this.props.history.push("/login")}
                  label={translate("aor.auth.login")}
                  fullWidth
                />
              </CardActions>
            </form>
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    );
  }
}

PasswordResetRequest.propTypes = {
  ...propTypes,
  authClient: PropTypes.func,
  previousRoute: PropTypes.string,
  theme: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};

PasswordResetRequest.defaultProps = {
  theme: {},
};

const enhance = compose(
  translate,
  reduxForm({
    form: "passwordResetRequest",
    validate: (values, props) => {
      const errors = {};
      const { translate } = props;
      if (!values.email) errors.email = translate("aor.validation.required");
      return errors;
    },
  }),
  connect(null, { showNotification }),
);

export default withRouter(enhance(PasswordResetRequest));
