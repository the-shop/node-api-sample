import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import inflection from "inflection";
import compose from "recompose/compose";
import DashboardIcon from "material-ui/svg-icons/action/dashboard";
import MenuItemLink from "admin-on-rest/lib/mui/layout/MenuItemLink";
import translate from "admin-on-rest/lib/i18n/translate";
import { getResources } from "admin-on-rest/lib/reducer";
import styles from "../customTheme";
import ExitIcon from "material-ui/svg-icons/action/power-settings-new";

import { userLogout as userLogoutAction } from "admin-on-rest/lib/actions/authActions";

const translatedResourceName = (resource, translate) =>
  translate(`resources.${resource.name}.name`, {
    smart_count: 2,
    _:
      resource.options && resource.options.label
        ? translate(resource.options.label, {
          smart_count: 2,
          _: resource.options.label,
        })
        : inflection.humanize(inflection.pluralize(resource.name)),
  });

const Menu = ({ narrow, hasDashboard, onMenuTap, resources, translate, userLogout }) => (
  <div style={narrow ? styles.sidebar.narrow : styles.sidebar.main}>
    {hasDashboard &&
      <MenuItemLink
        to="/"
        primaryText={translate("aor.page.dashboard")}
        leftIcon={<DashboardIcon style={styles.sidebar.menuItem} />}
        onClick={onMenuTap}
        style={styles.sidebar.menuItem}
      />
    }
    {resources
      .filter(r => r.list)
      .map(resource => (
        <MenuItemLink
          key={resource.name}
          to={`/${resource.name}`}
          primaryText={translatedResourceName(resource, translate)}
          leftIcon={<resource.icon style={styles.sidebar.menuItem} />}
          onClick={onMenuTap}
          style={styles.sidebar.menuItem}
        />
      ))}

    <MenuItemLink
      to="/"
      primaryText={translate("aor.auth.logout")}
      leftIcon={<ExitIcon style={styles.sidebar.menuItem} />}
      onClick={userLogout}
      style={styles.sidebar.menuItem}
    />
      
  </div>
);

Menu.propTypes = {
  hasDashboard: PropTypes.bool,
  userLogout: PropTypes.func,
  narrow: PropTypes.bool,
  onMenuTap: PropTypes.func,
  resources: PropTypes.array.isRequired,
  translate: PropTypes.func.isRequired,
};

Menu.defaultProps = {
  onMenuTap: () => null,
};

const mapStateToProps = state => ({
  resources: getResources(state),
});

const enhance = compose(translate, connect(mapStateToProps, { userLogout: userLogoutAction }));

export default enhance(Menu);
