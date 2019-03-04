import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import withWidth from "material-ui/utils/withWidth";
import { AppBarMobile, Restricted } from "admin-on-rest";
import { Card, CardTitle, CardActions } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";

import {
  deepOrange700,
} from "material-ui/styles/colors";

const styles = {
  card: { borderLeft: `solid 4px ${deepOrange700}`, flex: 1, margin: "0.5em" },
  cardActions: { width: "100%", textAlign: "right" },
  flex: { display: "flex", flexWrap: "wrap", marginLeft: "1em", marginRight: "1em" },
  fullWidthFlex: { display: "flex", flexWrap: "wrap", marginLeft: "0", marginRight: "0" },
  leftCol: { flex: "1 1 50%", marginRight: "0", marginLeft: "0", marginBottom: "0.5em", maxWidth: "50%" },
  rightCol: { flex: "1 1 50%", marginLeft: "0", marginRight: "0", marginBottom: "0.5em", maxWidth: "50%" },
  fullWidthCol: { flex: "1 1 100%", marginLeft: "0", marginRight: "0", marginBottom: "0.5em", maxWidth: "100%" },
};

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      totals: {
        Users: {},
        Posts: {},
        Comments: {},
      }
    };
  }


  render() {
    const { totals } = this.state;
    const { width } = this.props;

    return (
      <Restricted location={location}>

        <div style={width === 1 ? styles.fullWidthFlex : styles.flex}>

          {width === 1 && <AppBarMobile title="Node API Sample" />}

          {Object.keys(totals).map((key, index) => {
            const card = (
              <Card style={styles.card}>
                <CardTitle
                  subtitle={key.toDash().replace("-", " ").toUpperCase()}
                />
                <CardActions style={styles.cardActions}>
                  <FlatButton
                    label="View"
                    containerElement={<Link to={`/${key.lowerFirstChar().toDash().toLowerCase()}`} />}
                  />
                </CardActions>

              </Card>
            );

            if (width === 1) {
              return (
                <div style={styles.fullWidthCol} key={key}>
                  {card}
                </div>
              );
            }
            return (
              <div style={index % 2 === 0 ? styles.leftCol : styles.rightCol} key={key}>
                {card}
              </div>
            );
          })}

        </div>

      </Restricted>
    );
  }
}

Dashboard.propTypes = {
  width:PropTypes.number.isRequired,
};

Dashboard.propTypes = {
  width: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
};

export default withWidth()(withRouter(Dashboard));
