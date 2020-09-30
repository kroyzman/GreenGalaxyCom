import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import RevenueCards from "./RevenueCards/RevenueCards";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {
  faMale,
  faFemale,
  faTired,
  faDizzy,
  faTrophy,
  faMedal
} from "@fortawesome/free-solid-svg-icons";
import { scaleBand } from "@devexpress/dx-chart-core";
import { ArgumentScale, Stack, ValueScale } from "@devexpress/dx-react-chart";
import Card from "react-bootstrap/Card";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Tooltip
} from "@devexpress/dx-react-chart-bootstrap4";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const olimpicMedals = [
  {
    country: "אופיר",
    gold: 407
  },
  {
    country: "זוהר",
    gold: 512
  },
  {
    country: "נעמי",
    gold: 428
  },
  {
    country: "ריווה",
    gold: 359
  }
];

const Zohar = () => {
  return (
    <Container fluid className="m-5">
      <h1 className="m-5 text-center ">
        בית משפחת קרויזמן - החיים בצל הקורונה
      </h1>
      <h4 className="m-5 text-right ">:מספר האזכורים השבועי</h4>
      <Row>
        <Col>
          <RevenueCards
            title={`אופיר (מה אני אעשה איתה) קרויזמן`}
            content={"407"}
            icon={faDizzy}
            color={"DarkSalmon"}
          />
        </Col>
        <Col>
          <RevenueCards
            title={"נעמי"}
            content={"428"}
            icon={faFemale}
            color={"orange"}
          />
        </Col>
        <Col>
          <RevenueCards
            title={"זוהר"}
            content={"512"}
            icon={faMale}
            color={"brown"}
          />
        </Col>
        <Col>
          <RevenueCards
            title={"ריווה"}
            content={"359"}
            icon={faTired}
            color={"DarkKhaki"}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {" "}
          <Card>
            <Card.Body>
              {olimpicMedals ? (
                <Chart data={olimpicMedals}>
                  {/* <ValueScale name="margin" modifyDomain={modifyMarginDomain} /> */}

                  <ArgumentScale factory={scaleBand} />
                  <ArgumentAxis />
                  <ValueAxis />

                  <BarSeries
                    valueField="gold"
                    argumentField="country"
                    name="Percent"
                  />
                  <Stack />
                  {/* <Legend /> */}
                </Chart>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ height: "34rem" }}>
            <Card.Header className="text-right" style={{ fontSize: "2rem" }}>
              דירוגים
            </Card.Header>
            <div className="text-center mt-4 p-4">
              <span className="mr-3" style={{ fontSize: "2rem" }}>
                זוהר
              </span>
              <FontAwesomeIcon
                size="4x"
                icon={faTrophy}
                style={{ color: "orange" }}
              />
            </div>

            <div className="text-center mb-4">
              <span className="mr-3" style={{ fontSize: "2rem" }}>
                נעמי
              </span>
              <FontAwesomeIcon
                size="4x"
                icon={faMedal}
                style={{ color: "silver" }}
              />
            </div>
            <div className="text-center mb-4">
              <span className="mr-3" style={{ fontSize: "2rem" }}>
                ריווה
              </span>
              <FontAwesomeIcon
                size="4x"
                icon={faMedal}
                style={{ color: "#cd7f32" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <p
            className="text-right float-right"
            style={{ width: "60%", fontSize: "1.5rem" }}
          >
            אם כן זכייתו של זוהר אינה תדהמה של ממש וזאת לאחר ששמו עלה פעם אחר
            פעם בכותרות השבוע בעקבות פרשת הטיסה ליוון. בית משפחת קרויזמן עצר את
            נשימתו לקראת מועד הטיסה המיוחל בשאלה האם זוהר ואשתו(יש לציין כי ישנה
            הערכה רבה מאוד לאשתו של זוהר שבזכותה אין קרמיקה מעל האינדוקציה!) אכן
            יצליחו להגיע ליוון. עוד שאלות שעלו, מה הבן בן ה15 יעשה? האם ישלח
            לסבתא שלו באילת? האם זוהר הצליח להעביר את המחשב מהמשרד לבית? כל זאת
            ועוד בפרק הבא של בית משפחת קרויזמן - החיים בצל הקורונה. הפתעות
            בהמשך...
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Zohar;
