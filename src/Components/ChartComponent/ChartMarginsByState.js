import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Tooltip
} from "@devexpress/dx-react-chart-bootstrap4";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { scaleBand } from "@devexpress/dx-chart-core";
import { ArgumentScale, Stack } from "@devexpress/dx-react-chart";
import { EventTracker, Animation } from "@devexpress/dx-react-chart";

const Label = (symbol) => (props) => {
  const { text } = props;
  return <ValueAxis.Label {...props} text={text + symbol} />;
};

const MarginLabel = Label(" %");

const modifyMarginDomain = (domain) => [0, 5];

const ChartMarginsByState = ({ title, deals }) => {
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
      stateObject.margin = 0;
      stateObject.totalValue = 0;
    });

    dealsList.forEach((deal) => {
      let stateObject = data.find(
        (stateObjectItem) => stateObjectItem.state === deal.state
      );
      stateObject.margin += deal.dealValue - deal.dealCost;
      stateObject.totalValue += deal.dealValue;
    });

    data.forEach((stateObject) => {
      let total = stateObject.margin / stateObject.totalValue;
      stateObject.totalMargin = parseFloat(total * 100);
    });

    setDataObject(data);
  };

  return (
    <Card>
      <Card.Header>{title}</Card.Header>

      <Card.Body>
        {dataObject ? (
          <Chart data={dataObject}>
            {/* <ValueScale name="margin" modifyDomain={modifyMarginDomain} /> */}

            <ArgumentScale factory={scaleBand} />
            <ArgumentAxis />
            <ValueAxis labelComponent={MarginLabel} />

            <BarSeries
              valueField="totalMargin"
              argumentField="state"
              name="Percent"
            />
            <EventTracker />
            <Tooltip />
            <Animation />
            <Stack />
            {/* <Legend /> */}
          </Chart>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default ChartMarginsByState;
