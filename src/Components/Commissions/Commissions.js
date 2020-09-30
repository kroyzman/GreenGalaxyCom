import React, { useState, useEffect } from "react";
import DealerSelection from "./DealerSelection";
import CommissionTable from "./CommissionTable";
import TotalCard from "./TotalCard";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";
import DateBetweenPicker from "../DateBetweenPicker/DateBetweenPicker";
import Spinner from "react-spinners/BeatLoader";
import Container from "react-bootstrap/Container";
import SplitButton from "react-bootstrap/SplitButton";
import Dropdown from "react-bootstrap/Dropdown";

const Commissions = () => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(DOLLAR_SIGN);
  const [dateObject, setDateObject] = useState();
  const [dealerId, setDealerId] = useState();
  const [showTotals, setShowTotal] = useState(false);
  const [dealerTotalCommissions, setTotalDealerCommissions] = useState([]);
  const [dealerDirectCommissions, setDealerDiretCommissions] = useState([]);
  const [dealerDerivedCommissions, setDealerDerivedCommissions] = useState([]);
  const [dealerPartnershipCommissions, setPartnershipCommissions] = useState(
    []
  );

  const directHeaders = [
    "#",
    "Date",
    "Customer",
    "Country",
    "Invoice Number",
    "Deal Value",
    "Deal Cost",
    "Dealer",
    "Dealer Commission Rate",
    "Dealer Commission Amount"
  ];
  const derivedHeaders = [
    "#",
    "Date",
    "Customer",
    "Country",
    "Invoice Number",
    "Deal Value",
    "Dealer",
    "Dealer Commission Rate",
    "Dealer Commission Amount",
    "Derived Dealer",
    "Derived Dealer Commission Rate",
    "Derived Dealer Commission Amount"
  ];
  const partnershipHeaders = [
    "#",
    "Date",
    "Customer",
    "Country",
    "Invoice Number",
    "Deal Value",
    "Deal Cost",
    "Dealer",
    "Partner",
    "Partner Commission Rate",
    "Partner Commission Amount"
  ];

  // useEffect(() => {}, [currency]);

  const handleCommissionsForDealer = async (commissions, dealerId) => {
    setLoading(false);
    setShowTotal(true);
    setDealerId(dealerId);
    await setTotalDealerCommissions(commissions);
    setDealerDiretCommissions([]);
    setDealerDerivedCommissions([]);
    setPartnershipCommissions([]);
    setTotalDealerCommissions(commissions);

    setDirectCommissions(commissions);
    setDerivedCommissions(commissions);
    setPartnerCommissions(commissions);
  };

  const setPartnerCommissions = (commissions) => {
    const partnerCommissionsList = commissions.filter(
      (commission) =>
        commission.deal.dealer.name !== commission.dealer.name &&
        commission.dealer.section === commission.deal.dealProductsSection
    );

    setPartnershipCommissions(partnerCommissionsList);
  };

  const setDerivedCommissions = (commissions) => {
    const derivedCommissionsList = commissions.filter(
      (commission) =>
        commission.deal.dealer.name !== commission.dealer.name &&
        commission.dealer.section !== commission.deal.dealProductsSection
    );
    console.log("DERIVED COMMISSIONS: " + derivedCommissionsList);
    setDealerDerivedCommissions(derivedCommissionsList);
  };

  const handleSubmitDates = async (event, dateObj) => {
    event.preventDefault();
    console.log(dateObj);
    setDateObject(dateObj);
    setLoading(true);
    try {
      const data_url = `http://localhost:8080/commissions/byDate/${dealerId}?start_date=${dateObj["start_date"]}&end_date=${dateObj["end_date"]}`;

      const response = await fetch(data_url);
      const data = await response.json();
      setLoading(false);
      handleCommissionsForDealer(data);
    } catch (error) {
      console.error(`fetch operation failed: ${error}`);
    }
  };

  const setDirectCommissions = (commissions) => {
    const directCommissionsList = commissions.filter(
      (commission) => commission.deal.dealer.name === commission.dealer.name
    );
    console.log("DIRECT COMMISSIONS: " + directCommissionsList);
    setDealerDiretCommissions(directCommissionsList);
  };

  let showTotal;
  let excelWorkBook;

  if (showTotals) {
    showTotal = (
      <>
        <div className="text-center d-flex justify-content-center">
          <DateBetweenPicker handleSubmitDates={handleSubmitDates} />
        </div>
        <div className="mt-2">
          <h5 className="text-left">Direct Deals</h5>
          <CommissionTable
            headers={directHeaders}
            commissions={dealerDirectCommissions}
            type={"DIRECT"}
            currency={currency}
          />
        </div>
        <div className="mt-5">
          <h5 className="text-left ">Derived Deals</h5>
          <CommissionTable
            headers={derivedHeaders}
            commissions={dealerDerivedCommissions}
            type={"DERIVED"}
            currency={currency}
          />
        </div>
        <div className="mt-5">
          <h5 className="text-left">Partnership Deals</h5>
          <CommissionTable
            headers={partnershipHeaders}
            commissions={dealerPartnershipCommissions}
            type={"PARTNER"}
            currency={currency}
          />
        </div>
        <div className="mt-5">
          <TotalCard
            directDeals={dealerDirectCommissions}
            derivedDeals={dealerDerivedCommissions}
            partnerDeals={dealerPartnershipCommissions}
            totalCommissions={dealerTotalCommissions}
            currency={currency}
          />
        </div>
      </>
    );

    let dealerId;
    if (dealerTotalCommissions[0]) {
      dealerId = dealerTotalCommissions[0].dealer.id;
    }
    excelWorkBook = (
      <>
        <SplitButton drop={"up"} variant="success" title={"Export To Excel"}>
          <Dropdown.Item
            href={`http://localhost:8080/report/Commission Report/${dealerId}?currency=USD`}
          >
            $ USD
          </Dropdown.Item>
          <Dropdown.Item
            href={`http://localhost:8080/report/Commission Report/${dealerId}?currency=ILS`}
          >
            ₪ NIS
          </Dropdown.Item>
        </SplitButton>
      </>
    );
  }

  const handleCurrency = (sign) => {
    setCurrency(sign);
  };

  const loadingInit = () => {
    setLoading(true);
  };

  return (
    <>
      <div className="d-flex flex-row-reverse justify-content-sm-between mb-3 mt-3">
        <CurrencyDropdown handleCurrency={handleCurrency} />
        <DealerSelection
          handleCommissionsForDealer={handleCommissionsForDealer}
          loadingInit={loadingInit}
        />
      </div>
      {loading ? (
        <Container
          fluid
          className="d-flex justify-content-center align-items-center p-5 mt-5"
        >
          <Spinner size={50} color={"CadetBlue"} loading={loading} />
        </Container>
      ) : (
        <>
          {showTotal}
          <div class="m-3 text-center">{excelWorkBook}</div>
        </>
      )}
    </>
  );
};

export default Commissions;
