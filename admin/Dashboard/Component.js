import React, { Component } from "react";
import PropTypes from "prop-types";
import withWidth from "material-ui/utils/withWidth";
import { AppBarMobile } from "admin-on-rest";
import { Card, CardTitle, CardActions } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { fetchJson } from "../jsonServer";
import cookies from "../Cookies";

const styles = {
  card: { borderLeft: "solid 4px #ff9800", flex: 1, margin: "0" },
  cardActions: { width: "100%", textAlign: "right" },
  flex: { display: "flex", flexWrap: "wrap", marginLeft: "1em", marginRight: "1em" },
  fullWidthFlex: { display: "flex", flexWrap: "wrap", marginLeft: "0", marginRight: "0" },
  leftCol: { flex: "1 1 50%", marginRight: "1em", marginLeft: "-1em", marginBottom: "0.5em", maxWidth: "50%" },
  rightCol: { flex: "1 1 50%", marginLeft: "1em", marginRight: "-1em", marginBottom: "0.5em", maxWidth: "50%" },
  fullWidthCol: { flex: "1 1 100%", marginLeft: "0", marginRight: "0", marginBottom: "0.5em", maxWidth: "100%" },
};

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      stats: {
        totals: {}
      },
    };
  }

  componentDidMount() {
    const token = cookies.get("Authorization", { path: "/" });
    fetchJson("api/v1/statistics/counts", { user : { token, authenticated: true } })
      .then(response => response.json)
      .then(response => this.setState({ stats: response.model }));
  }

  render() {
    const { totals } = this.state.stats;
    const { width } = this.props;

    return (
      <div>
        {width === 1 && <AppBarMobile title="Admin Dashboard" />}

        <div style={width === 1 ? styles.fullWidthFlex : styles.flex}>
          {Object.keys(totals).map((key, index) => {
            const card = (
              <Card style={styles.card}>
                <CardTitle title={totals[key]} subtitle={key.toDash().replace("-", " ").toUpperCase()} />

                <CardActions style={styles.cardActions}>
                  <FlatButton label="View" href={`/admin#/${key.toDash()}`} />
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

      </div>
    );
  }
}

Dashboard.propTypes = {
  width:PropTypes.number.isRequired,
};

export default withWidth()(Dashboard);
