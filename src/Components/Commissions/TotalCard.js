import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const TotalCard = ({
  totalCommissions,
  directDeals,
  derivedDeals,
  partnerDeals,
  currency
}) => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  const VAT = 1.17;

  const sum = (commissionsForSum, key) => {
    let totals = 0;
    if (Array.isArray(commissionsForSum) && commissionsForSum.length) {
      for (const commission of commissionsForSum) {
        if (currency === SHEKEL_SIGN) {
          totals += commission[key] * commission.deal.currentDollarValue;
        } else {
          totals += commission[key];
        }
      }
    }
    return totals;
  };

  const sumByDeals = (commissionsForSum) => {
    let totals = 0;
    if (Array.isArray(commissionsForSum) && commissionsForSum.length) {
      for (const commission of commissionsForSum) {
        if (currency === SHEKEL_SIGN) {
          totals +=
            commission.deal["dealValue"] * commission.deal.currentDollarValue;
        } else {
          totals += commission.deal["dealValue"];
        }
      }
    }
    return totals;
  };

  function getFormattedCurrency(num) {
    num = num.toFixed(2);
    var cents = (num - Math.floor(num)).toFixed(2);
    return Math.floor(num).toLocaleString() + "." + cents.split(".")[1];
  }

  const currencySwitch = (value) => {
    if (currency === DOLLAR_SIGN) {
      return DOLLAR_SIGN + getFormattedCurrency(value);
    }

    return SHEKEL_SIGN + getFormattedCurrency(value);
  };

  return (
    <>
      <Card
        bg="light"
        text="dark"
        style={{ width: "60rem" }}
        className="mb-2 text-left"
      >
        <Card.Header>Sum</Card.Header>
        <Card.Body>
          <Card.Title>
            {" "}
            Total Commission Amount:{" "}
            <b>
              {currencySwitch(
                sum(totalCommissions, "dealCommissionAmountForDealer")
              )}
            </b>
          </Card.Title>
          {currency === SHEKEL_SIGN ? (
            <Card.Title>
              {" "}
              Total Commission Amount VAT Include:{" "}
              <b>
                {currencySwitch(
                  sum(totalCommissions, "dealCommissionAmountForDealer") * VAT
                )}
              </b>
            </Card.Title>
          ) : null}

          <Card.Text className="mt-5">
            <Row>
              <Col>
                <p>
                  Num Of Deals: <b>{totalCommissions.length}</b>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Num Of Direct Deals: <b>{directDeals.length}</b>
                </p>
              </Col>
              <Col>
                <p>
                  Direct Deals Total Commission Amount:{" "}
                  <b>
                    {currencySwitch(
                      sum(directDeals, "dealCommissionAmountForDealer")
                    )}
                  </b>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Num Of Derived Deals: <b>{derivedDeals.length}</b>
                </p>
              </Col>
              <Col>
                <p>
                  Derived Deals Total Commission Amount:{" "}
                  <b>
                    {currencySwitch(
                      sum(derivedDeals, "dealCommissionAmountForDealer")
                    )}
                  </b>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Num Of Partnership Deals: <b>{partnerDeals.length}</b>
                </p>
              </Col>
              <Col>
                <p>
                  Partnership Deals Total Commission Amount:{" "}
                  <b>
                    {currencySwitch(
                      sum(partnerDeals, "dealCommissionAmountForDealer")
                    )}
                  </b>
                </p>
              </Col>
            </Row>
          </Card.Text>
          <hr />
        </Card.Body>
        <Card.Body>
          <Card.Text>
            <Row>
              <Col>
                <p>
                  Total Deals Amount:{" "}
                  <b>{currencySwitch(sumByDeals(totalCommissions))}</b>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Total Direct Deals Amount:{" "}
                  <b>{currencySwitch(sumByDeals(directDeals))}</b>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Total Derived Deals Amount:{" "}
                  <b>{currencySwitch(sumByDeals(derivedDeals))}</b>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Total Partnership Deals Amount:{" "}
                  <b>{currencySwitch(sumByDeals(partnerDeals))}</b>
                </p>
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default TotalCard;
