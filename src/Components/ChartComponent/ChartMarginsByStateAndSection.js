import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Legend,
  Tooltip
} from "@devexpress/dx-react-chart-bootstrap4";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { scaleBand } from "@devexpress/dx-chart-core";
import { ArgumentScale, Stack } from "@devexpress/dx-react-chart";
import { EventTracker, Animation } from "@devexpress/dx-react-chart";
const ChartMarginsByStateAndSection = ({ title, deals }) => {
  const [dataObject, setDataObject] = useState();

  useEffect(() => {
    constructDataObjectFromDealsList(deals);
  }, [deals]);

  const constructDataObjectFromDealsList = (dealsList) => {
    let data = [];

    dealsList.forEach((deal) => {
      let stateObject = data.find(
        (stateObjectItem) => stateObjectItem.state === deal.state
      );
      if (!stateObject) {
        data.push({
          state: String(deal.state),
          industry: {},
          special: {},
          aviation: {},
          rail: {},
          cosmetics: {}
        });
      }
    });

    data.forEach((stateObject) => {
      stateObject.industry.margin = 0;
      stateObject.industry.totalValue = 0;

      stateObject.special.margin = 0;
      stateObject.special.totalValue = 0;

      stateObject.aviation.margin = 0;
      stateObject.aviation.totalValue = 0;

      stateObject.rail.margin = 0;
      stateObject.rail.totalValue = 0;

      stateObject.cosmetics.margin = 0;
      stateObject.cosmetics.totalValue = 0;
    });

    dealsList.forEach((deal) => {
      let stateObject = data.find(
        (stateObjectItem) => stateObjectItem.state === deal.state
      );
      switch (deal.dealProductsSection) {
        case "INDUSTRY":
          stateObject.industry.margin += deal.dealValue - deal.dealCost;
          stateObject.industry.totalValue += deal.dealValue;

          break;
        case "SPECIAL":
          stateObject.special.margin += deal.dealValue - deal.dealCost;
          stateObject.special.totalValue += deal.dealValue;

          break;
        case "COSMETICS":
          stateObject.cosmetics.margin += deal.dealValue - deal.dealCost;
          stateObject.cosmetics.totalValue += deal.dealValue;

          break;
        case "RAIL":
          stateObject.rail.margin += deal.dealValue - deal.dealCost;
          stateObject.rail.totalValue += deal.dealValue;

          break;
        case "AVIATION":
          stateObject.aviation.margin += deal.dealValue - deal.dealCost;
          stateObject.aviation.totalValue += deal.dealValue;

          break;
        default:
      }
    });

    data.forEach((stateObject) => {
      let totalIndustry =
        stateObject.industry.margin / stateObject.industry.totalValue;
      stateObject.industryTotalMargin = parseFloat(totalIndustry * 100);

      let totalSpecial =
        stateObject.special.margin / stateObject.special.totalValue;
      stateObject.specialTotalMargin = parseFloat(totalSpecial * 100);

      let totalCosmetics =
        stateObject.cosmetics.margin / stateObject.cosmetics.totalValue;
      stateObject.cosmeticsTotalMargin = parseFloat(totalCosmetics * 100);

      let totalRail = stateObject.rail.margin / stateObject.rail.totalValue;
      stateObject.railTotalMargin = parseFloat(totalRail * 100);

      let totalAviation =
        stateObject.aviation.margin / stateObject.aviation.totalValue;
      stateObject.aviationTotalMargin = parseFloat(totalAviation * 100);
    });

    console.log(data);
    setDataObject(data);
  };

  return (
    <Card>
      <Card.Header>{title}</Card.Header>

      <Card.Body>
        {dataObject ? (
          <Chart data={dataObject}>
            <ArgumentScale factory={scaleBand} />
            <ArgumentAxis />
            <ValueAxis />

            <BarSeries
              valueField={"industryTotalMargin"}
              argumentField="state"
              name="Industry"
            />
            <BarSeries
              valueField="aviationTotalMargin"
              argumentField="state"
              name="Aviation"
            />
            <BarSeries
              valueField="cosmeticsTotalMargin"
              argumentField="state"
              name="Cosmetics"
            />
            <BarSeries
              valueField="specialTotalMargin"
              argumentField="state"
              name="Special"
            />
            <BarSeries
              valueField="railTotalMargin"
              argumentField="state"
              name="Rail"
            />
            <EventTracker />
            <Tooltip />
            <Stack />
            <Animation />
            <Legend />
          </Chart>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default ChartMarginsByStateAndSection;
