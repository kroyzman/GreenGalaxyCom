import React, { useState, useEffect } from "react";
import Table from "../Table/TableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal/ModalComponent";
import DealForm from "../DealForm/DealForm";
import Card from "react-bootstrap/Card";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";
import DateBetweenPicker from "../DateBetweenPicker/DateBetweenPicker";
import Spinner from "react-spinners/BeatLoader";
import Container from "react-bootstrap/Container";

const Deals = () => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  const [deals, setDeals] = useState([]);
  const [show, setShow] = useState(false);
  const [currency, setCurrency] = useState(DOLLAR_SIGN);
  const handleClose = () => setShow(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event, values) => {
    event.preventDefault();
    setShow(false);
    console.log("DEAL: " + values.currentDollarValue);
    postData(values);
  };

  async function postData(data = {}) {
    // Default options are marked with *
    const response = await fetch("http://localhost:8080/deals/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const returnedDeal = await response.json();

    const newDealList = [...deals];
    newDealList.push(returnedDeal);
    setDeals(newDealList);
  }

  const deleteDeal = async (dealId) => {
    setLoading(true);
    try {
      const data_url = `http://localhost:8080/deals/delete/${dealId}`;

      const response = await fetch(data_url, {
        method: "DELETE"
      });
      const data = await response.json();
      console.log("DELETE " + data);
      const newDealList = [...deals];
      newDealList.splice(
        deals.findIndex(function (item) {
          return item.id === dealId;
        }),
        1
      );
      setDeals(newDealList);
      setLoading(false);
    } catch (error) {
      console.error(`fetch operation failed: ${error}`);
    }
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

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const data_url = "http://localhost:8080/deals/deals_all";

        const response = await fetch(data_url);
        const data = await response.json();
        setLoading(false);
        console.log(data);
        setDeals(data);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
      // ...
    }
    fetchData();
  }, [currency]);

  function getFormattedCurrency(num) {
    num = num.toFixed(2);
    var cents = (num - Math.floor(num)).toFixed(2);
    return Math.floor(num).toLocaleString() + "." + cents.split(".")[1];
  }

  const handleCurrency = (sign) => {
    setCurrency(sign);
  };

  const currencySwitch = () => {
    if (currency === DOLLAR_SIGN) {
      return DOLLAR_SIGN + getFormattedCurrency(sumDollar(deals));
    }

    return SHEKEL_SIGN + getFormattedCurrency(sumShekel(deals));
  };

  const handleSubmitDates = (event, dateObj) => {
    event.preventDefault();
    setLoading(true);
    async function fetchDateBetweens() {
      try {
        const data_url = `http://localhost:8080/deals/deals_all/date?start_date=${dateObj["start_date"]}&end_date=${dateObj["end_date"]}`;

        const response = await fetch(data_url);
        const data = await response.json();
        setLoading(false);
        setDeals(data);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
      // ...
    }
    fetchDateBetweens();
  };

  const sortDeals = (type) => {
    const filteredList = [...deals];

    switch (type) {
      case "dealValue":
        filteredList.sort((a, b) => b.dealValue - a.dealValue);
        break;
      case "dealCost":
        filteredList.sort((a, b) => b.dealCost - a.dealCost);
        break;
      case "invoiceNumber":
        filteredList.sort((a, b) => b.invoiceNumber - a.invoiceNumber);
        break;
      case "date":
        filteredList.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "customer":
        filteredList.sort((a, b) =>
          a.customer > b.customer ? 1 : b.customer > a.customer ? -1 : 0
        );
        break;
      case "state":
        filteredList.sort((a, b) =>
          a.state > b.state ? 1 : b.state > a.state ? -1 : 0
        );
        break;
      case "dealProductsSection":
        filteredList.sort((a, b) =>
          a.dealProductsSection > b.dealProductsSection
            ? 1
            : b.dealProductsSection > a.dealProductsSection
            ? -1
            : 0
        );
        break;
      case "name":
        filteredList.sort((a, b) =>
          a.dealer.name > b.dealer.name
            ? 1
            : b.dealer.name > a.dealer.name
            ? -1
            : 0
        );
        break;
      default:
    }

    setDeals(filteredList);
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
          <div className="d-flex flex-row-reverse justify-content-sm-between mb-3 mt-3">
            <CurrencyDropdown handleCurrency={handleCurrency} />
            <button
              onClick={() => setShow(true)}
              className="btn btn-outline-secondary btn-rounded waves-effect float-left"
            >
              <FontAwesomeIcon icon={faPlus} /> ADD DEAL
            </button>
          </div>
          <div className="text-center d-flex justify-content-center">
            <DateBetweenPicker handleSubmitDates={handleSubmitDates} />
          </div>
          <Modal
            show={show}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            title={"DEAL"}
          >
            <DealForm handleClose={handleClose} handleSubmit={handleSubmit} />
          </Modal>
          <Table
            deleteDeal={deleteDeal}
            deals={deals}
            currency={currency}
            sortDeals={sortDeals}
          />
          <Card
            bg="light"
            text="dark"
            style={{ width: "20rem" }}
            className="mb-2 text-left"
          >
            <Card.Header>Sum</Card.Header>
            <Card.Body>
              <Card.Title>Total Deals Amount: {currencySwitch()}</Card.Title>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default Deals;
