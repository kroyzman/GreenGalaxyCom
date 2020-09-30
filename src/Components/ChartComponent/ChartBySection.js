import React from "react";
import Card from "react-bootstrap/Card";
import {
  Chart,
  Legend,
  PieSeries,
  Tooltip
} from "@devexpress/dx-react-chart-bootstrap4";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { EventTracker } from "@devexpress/dx-react-chart";

const ChartByStateSection = ({
  industryCount,
  aviationCount,
  cosmeticsCount,
  specialCount,
  railCount,
  title
}) => {
  const sectionData = [
    { section: "Industry", area: industryCount },
    { section: "Aviation", area: aviationCount },
    { section: "Cosmetics", area: cosmeticsCount },
    { section: "Special", area: specialCount },
    { section: "Rail", area: railCount }
  ];
  return (
    <Card>
      <Card.Header>{title}</Card.Header>

      <Card.Body>
        <Chart data={sectionData}>
          <PieSeries valueField="area" argumentField="section" />

          <EventTracker />
          <Tooltip />

          <Legend />
        </Chart>
      </Card.Body>
    </Card>
  );
};

export default ChartByStateSection;
