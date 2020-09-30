import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ChartBySection from "../ChartComponent/ChartBySection";
import ChartByStateSection from "../ChartComponent/ChartByStateSection";
import RevenueCards from "../RevenueCards/RevenueCards";
import {
  faCoins,
  faMoneyCheckAlt,
  faHandHoldingUsd,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Spinner from "react-spinners/BeatLoader";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";

const LandingPage = () => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  const [earnings, setEarnings] = useState();
  const [deals, setDeals] = useState([]);
  const [dealsCount, setDealsCount] = useState(0);
  const [dealersCount, setDealersCount] = useState(0);
  const [commissionsSum, setCommissionsSum] = useState(0);
  const [cosmeticsCount, setCosmeticsCount] = useState(0);
  const [industryCount, setIndustryCount] = useState(0);
  const [specialCount, setSpecialCount] = useState(0);
  const [aviationCount, setAviationCount] = useState(0);
  const [railCount, setRailCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(DOLLAR_SIGN);

  function getFormattedCurrency(num) {
    num = num.toFixed(2);
    var cents = (num - Math.floor(num)).toFixed(2);
    return Math.floor(num).toLocaleString() + "." + cents.split(".")[1];
  }

  useEffect(() => {
    setLoading(true);
    async function fetchDeals() {
      try {
        const data_url = "http://localhost:8080/deals/deals_all";

        const response = await fetch(data_url);
        const data = await response.json();
        setDeals(data);
        handleEarningsAndCountForDeals(data);
        handleSectionChart(data);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
    }

    async function fetchDealers() {
      try {
        const data_url = "http://localhost:8080/dealers/dealers_count";

        const response = await fetch(data_url);
        const data = await response.json();
        setDealersCount(data);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
      // ...
    }

    async function fetchCommissionsSum() {
      try {
        let currencyForFetch;
        currency === DOLLAR_SIGN
          ? (currencyForFetch = "USD")
          : (currencyForFetch = "ILS");
        const data_url = `http://localhost:8080/commissions/all/sum?currency=${currencyForFetch}`;

        const response = await fetch(data_url);
        const data = await response.json();

        setCommissionsSum(Number(data));
        setLoading(false);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
      // ...
    }

    fetchDeals();
    fetchDealers();
    fetchCommissionsSum();
  }, [currency]);

  const handleEarningsAndCountForDeals = (dealsList) => {
    let total = 0;
    if (Array.isArray(dealsList) && dealsList.length) {
      for (const deal of dealsList) {
        total += deal.dealValue;
      }

      setEarnings(Number(total));
      setDealsCount(dealsList.length);
    }

    total = 0;
  };

  const currencySwitch = () => {
    if (currency === DOLLAR_SIGN) {
      return DOLLAR_SIGN + getFormattedCurrency(sumDollar(deals));
    }

    return SHEKEL_SIGN + getFormattedCurrency(sumShekel(deals));
  };

  const currencySwitchForCommissions = () => {
    if (currency === DOLLAR_SIGN) {
      return DOLLAR_SIGN + getFormattedCurrency(commissionsSum);
    }

    return SHEKEL_SIGN + getFormattedCurrency(commissionsSum);
  };

  const sumDollar = (dealsForSum) => {
    let total = 0;
    if (Array.isArray(dealsForSum) && dealsForSum.length) {
      for (const deal of dealsForSum) {
        total += deal.dealValue;
      }
    }
    return total;
  };

  const sumShekel = (dealsForSum) => {
    let total = 0;
    if (Array.isArray(dealsForSum) && dealsForSum.length) {
      for (const deal of dealsForSum) {
        total += deal.dealValue * deal.currentDollarValue;
      }
    }
    return total;
  };

  const handleSectionChart = (dealsList) => {
    let cosmetics = 0,
      industry = 0,
      special = 0,
      aviation = 0,
      rail = 0;

    dealsList.forEach((deal) => {
      switch (deal.dealProductsSection) {
        case "COSMETICS":
          cosmetics++;
          break;
        case "INDUSTRY":
          industry++;
          break;
        case "SPECIAL":
          special++;
          break;
        case "AVIATION":
          aviation++;
          break;
        case "RAIL":
          rail++;
          break;
        default:
      }
    });
    setCosmeticsCount(cosmetics);
    setIndustryCount(industry);
    setSpecialCount(special);
    setAviationCount(aviation);
    setRailCount(rail);
  };

  const handleCurrency = (sign) => {
    setCurrency(sign);
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
              <h4>Dashboard</h4>
              <CurrencyDropdown handleCurrency={handleCurrency} />
            </Row>
            <Row>
              <Col>
                <RevenueCards
                  title={"Earnings"}
                  content={`${earnings ? currencySwitch() : ""}`}
                  icon={faCoins}
                  color={"orange"}
                />
              </Col>
              <Col>
                <RevenueCards
                  title={"Deals"}
                  content={dealsCount}
                  icon={faMoneyCheckAlt}
                  color={"CadetBlue"}
                />
              </Col>
              <Col>
                <RevenueCards
                  title={"Dealers"}
                  content={dealersCount}
                  icon={faUsers}
                  color={"CornflowerBlue"}
                />
              </Col>
              <Col>
                <RevenueCards
                  title={"Commissions"}
                  content={`${
                    commissionsSum ? currencySwitchForCommissions() : ""
                  }`}
                  icon={faHandHoldingUsd}
                  color={"Coral"}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ChartBySection
                  className="shadow"
                  title={"Section Overview"}
                  industryCount={industryCount}
                  aviationCount={aviationCount}
                  cosmeticsCount={cosmeticsCount}
                  specialCount={specialCount}
                  railCount={railCount}
                />
              </Col>
              <Col>
                <ChartByStateSection
                  className="shadow"
                  title={"Fields By State"}
                  deals={deals}
                />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default LandingPage;
