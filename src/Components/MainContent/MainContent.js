import React, { Component } from "react";
import Dealers from "../Dealers/Dealers";
import { Route } from "react-router-dom";
import LandingPage from "../LandingPage/LandingPage";
import Deals from "../Deals/Deals";
import Commissions from "../Commissions/Commissions";
import Margins from "../Margins/Margins";
import Zohar from "../Zohar";

class MainContent extends Component {
  state = {};

  async componentDidMount() {}

  render() {
    return (
      <>
        <Route exact path="/" component={LandingPage} />
        <Route path="/dealers" component={Dealers} />
        <Route path="/deals" component={Deals} />
        <Route path="/commissions" component={Commissions} />
        <Route path="/margins" component={Margins} />
        <Route path="/zohar" component={Zohar} />
        {/* <Dealers /> */}
      </>
    );
  }
}

export default MainContent;
