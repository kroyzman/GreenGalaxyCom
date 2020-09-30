import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import ChartMarginsByState from "../ChartComponent/ChartMarginsByState";
import ChartMarginsByStateAndSection from "../ChartComponent/ChartMarginsByStateAndSection";
import RevenueCards from "../RevenueCards/RevenueCards";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {
  faCoins,
  faCommentDollar,
  faPercent
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-spinners/BeatLoader";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";

const Margins = () => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  const [deals, setDeals] = useState([]);
  const [totalGrossMargin, setTotalGrossMargin] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [grossMarginPercent, setGrossMarginPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(DOLLAR_SIGN);

  useEffect(() => {
    setLoading(true);
    async function fetchDeals() {
      try {
        const data_url = "http://localhost:8080/deals/deals_all";

        const response = await fetch(data_url);
        const data = await response.json();
        setDeals(data);
        calculateTotalMarginProfit(data);
        setLoading(false);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
    }
    fetchDeals();
  }, [currency]);

  const calculateTotalMarginProfit = (dealsList) => {
    let totalGrossMargin = 0,
      totalEarnings = 0,
      grossMarginPercent = 0;
    dealsList.forEach((deal) => {
      if (currency === DOLLAR_SIGN) {
        totalGrossMargin += deal.dealValue - deal.dealCost;
        totalEarnings += deal.dealValue;
      } else {
        totalGrossMargin +=
          (deal.dealValue - deal.dealCost) * deal.currentDollarValue;
        totalEarnings += deal.dealValue * deal.currentDollarValue;
      }
    });
    grossMarginPercent = (totalGrossMargin / totalEarnings) * 100;
    setTotalGrossMargin(totalGrossMargin);
    setTotalEarnings(totalEarnings);
    setGrossMarginPercent(grossMarginPercent.toFixed(2));
  };

  function getFormattedCurrency(num) {
    num = num.toFixed(2);
    var cents = (num - Math.floor(num)).toFixed(2);
    return Math.floor(num).toLocaleString() + "." + cents.split(".")[1];
  }

  const handleCurrency = (sign) => {
    setCurrency(sign);
  };

  const currencySwitch = (value) => {
    if (currency === DOLLAR_SIGN) {
      return DOLLAR_SIGN + getFormattedCurrency(value);
    }

    return SHEKEL_SIGN + getFormattedCurrency(value);
  };

  return (
    <>
      {loading ? (
        <Container
          fluid
          className="d-flex justify-content-center align-items-center p-5 mt-5"
        >
          <Spinner size={50} color={"CadetBlue"} loading={loading} />
        </Container>
      ) : (
        <>
          <Container fluid>
            <Row className="m-3 d-flex justify-content-between">
              <h4>Margins</h4>
              <CurrencyDropdown handleCurrency={handleCurrency} />
            </Row>
            <Row>
              <Col>
                <RevenueCards
                  title={"Earnings"}
                  content={`${
                    totalEarnings ? currencySwitch(totalEarnings) : ""
                  }`}
                  icon={faCoins}
                  color={"orange"}
                />
              </Col>
              <Col>
                <RevenueCards
                  title={"Gross Margin"}
                  content={`${
                    totalGrossMargin ? currencySwitch(totalGrossMargin) : ""
                  }`}
                  icon={faCommentDollar}
                  color={"brown"}
                />
              </Col>
              <Col>
                <RevenueCards
                  title={"Gross Margin Percent"}
                  content={`%${grossMarginPercent ? grossMarginPercent : ""}`}
                  icon={faPercent}
                  color={"DarkSalmon"}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ChartMarginsByState
                  deals={deals}
                  title={"Margins Percent By Country"}
                />
              </Col>
              <Col>
                <ChartMarginsByStateAndSection
                  deals={deals}
                  title={"Margins Percent By Country And State"}
                />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default Margins;
