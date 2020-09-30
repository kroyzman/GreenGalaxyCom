import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Legend
} from "@devexpress/dx-react-chart-bootstrap4";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { scaleBand } from "@devexpress/dx-chart-core";
import { ArgumentScale, Stack, Animation } from "@devexpress/dx-react-chart";

const ChartByStateSection = ({ title, deals }) => {
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
        data.push({ state: String(deal.state) });
      }
    });

    data.forEach((stateObject) => {
      stateObject.industry = 0;
      stateObject.special = 0;
      stateObject.aviation = 0;
      stateObject.rail = 0;
      stateObject.cosmetics = 0;
    });

    dealsList.forEach((deal) => {
      let stateObject = data.find(
        (stateObjectItem) => stateObjectItem.state === deal.state
      );
      switch (deal.dealProductsSection) {
        case "INDUSTRY":
          stateObject.industry++;
          break;
        case "SPECIAL":
          stateObject.special++;
          break;
        case "COSMETICS":
          stateObject.cosmetics++;
          break;
        case "RAIL":
          stateObject.rail++;
          break;
        case "AVIATION":
          stateObject.aviation++;
          break;
        default:
      }
    });

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
              valueField="industry"
              argumentField="state"
              name="Industry"
            />
            <BarSeries
              valueField="aviation"
              argumentField="state"
              name="Aviation"
            />
            <BarSeries
              valueField="cosmetics"
              argumentField="state"
              name="Cosmetics"
            />
            <BarSeries
              valueField="special"
              argumentField="state"
              name="Special"
            />
            <BarSeries valueField="rail" argumentField="state" name="Rail" />
            <Stack />
            <Animation />
            <Legend />
          </Chart>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default ChartByStateSection;
