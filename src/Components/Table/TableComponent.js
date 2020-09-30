import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPencilAlt,
  faCheckCircle,
  faBan,
  faSort
} from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";

const TableComponent = ({
  dealers,
  dealersLength,
  deals,
  deleteDeal,
  deleteDealer,
  currency,
  updateDealerOnConfirm,
  sortDeals,
  loadingInit
}) => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dealForDelete, setDealForDelete] = useState();
  const [dealerForDelete, setDealerForDelete] = useState();
  const [updateDealer, setUpdateDealer] = useState([]);
  const [showUpdateDealerConfirm, setShowUpdateDealerConfirm] = useState(false);
  const [refCommissionBase, setRefCommissionBase] = useState([]);
  const [refCommissionDerived, setRefCommissionDerived] = useState([]);
  const [refPartnerSection, setRefPartnerSection] = useState([]);
  const [refCommissionPartner, setRefCommissionPartner] = useState([]);
  const [refDealerDerived, setRefDealerDerived] = useState([]);
  const [valuesForUpdate, setValuesForUpdate] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const SECTIONS = [
    "NONE",
    "SPECIAL",
    "INDUSTRY",
    "COSMETICS",
    "RAIL",
    "AVIATION"
  ];

  useEffect(() => {
    setUpdateDealer(Array.from({ length: dealersLength }).map(() => false));

    setRefCommissionBase(
      Array.from({ length: dealersLength }).map(() => React.createRef())
    );
    setRefCommissionDerived(
      Array.from({ length: dealersLength }).map(() => React.createRef())
    );
    setRefPartnerSection(
      Array.from({ length: dealersLength }).map(() => React.createRef())
    );
    setRefCommissionPartner(
      Array.from({ length: dealersLength }).map(() => React.createRef())
    );
    setRefDealerDerived(
      Array.from({ length: dealersLength }).map(() => React.createRef())
    );
  }, [dealersLength, dealers]);

  let tableHead, tableBody;

  function getFormattedCurrency(num) {
    num = num.toFixed(2);
    var cents = (num - Math.floor(num)).toFixed(2);
    return Math.floor(num).toLocaleString() + "." + cents.split(".")[1];
  }

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {dealers ? "Delete Dealer" : "Delete Deal"}
    </Tooltip>
  );

  const renderTooltipUpdate = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Update Dealer
    </Tooltip>
  );

  const renderTooltipConfirmUpdate = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Confirm Update
    </Tooltip>
  );

  const renderTooltipCancelUpdate = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Cancel Update
    </Tooltip>
  );

  const currencySwitch = (value, rate) => {
    if (currency === DOLLAR_SIGN) {
      return DOLLAR_SIGN + getFormattedCurrency(value);
    }

    return SHEKEL_SIGN + getFormattedCurrency(value * rate);
  };

  const handleUpdateDealer = (key, dealer) => {
    const newUpdateDealerList = [...updateDealer];
    newUpdateDealerList[key] = true;
    setUpdateDealer(newUpdateDealerList);
    setShowUpdateDealerConfirm(true);

    setValuesForUpdate({ ...dealer });

    refCommissionBase[key].current.classList.remove("d-none");
    refCommissionDerived[key].current.classList.remove("d-none");
    refPartnerSection[key].current.classList.remove("d-none");
    refCommissionPartner[key].current.classList.remove("d-none");
    refDealerDerived[key].current.classList.remove("d-none");
  };

  const handleUpdateChange = (event, key) => {
    let value = event.target.value;
    const newValues = { ...valuesForUpdate };

    if (event.target.id === "baseCommissionRate") {
      if (value <= 0 || value > 100) {
        refCommissionBase[key].current.classList.add("is-invalid");
        refCommissionBase[key].current.value = 0;
      } else {
        refCommissionBase[key].current.classList.remove("is-invalid");
      }
    }

    if (event.target.id === "aboveCommissionRate") {
      if (value <= 0 || value > 100) {
        refCommissionDerived[key].current.classList.add("is-invalid");
        refCommissionDerived[key].current.value = 0;
      } else {
        refCommissionDerived[key].current.classList.remove("is-invalid");
      }
    }

    if (event.target.id === "partnerCommissionRate") {
      if (value < 0 || value > 100) {
        refCommissionPartner[key].current.classList.add("is-invalid");
        refCommissionPartner[key].current.value = 0;
      } else {
        refCommissionPartner[key].current.classList.remove("is-invalid");
      }
    }

    if (event.target.id === "dealerAbove") {
      if (value === "NONE") {
        delete newValues["dealerAbove"];
        setValuesForUpdate(newValues);
        return;
      }
      value = dealers.find((dealer) => dealer.name === value);
    }
    if (event.target.id === "section") {
      if (value === "NONE") {
        delete newValues["section"];
        setValuesForUpdate(newValues);
        return;
      }
    }
    setValuesForUpdate({ ...valuesForUpdate, [event.target.id]: value });
  };

  const updateDealerOnConfirmTable = (valuesForUpdate, key, dealer) => {
    if (valuesForUpdate.partnerCommissionRate > 0 && !valuesForUpdate.section) {
      setErrorMessage(
        "Please pick partner section or pick commission partner 0!"
      );
      return;
    }

    if (
      (valuesForUpdate.partnerCommissionRate <= 0 && valuesForUpdate.section) ||
      (valuesForUpdate.partnerCommissionRate === "0" && valuesForUpdate.section)
    ) {
      setErrorMessage(
        "Please pick partner commission or leave section partner blank!"
      );
      return;
    }

    if (valuesForUpdate.baseCommissionRate <= 0) {
      setErrorMessage("Base Commission cant be 0!");
      return;
    }

    if (valuesForUpdate.aboveCommissionRate <= 0) {
      setErrorMessage("Derived Commission cant be 0!");
      return;
    }

    updateDealerOnConfirm(valuesForUpdate);
    resetUpdateValues(key, dealer);
  };

  const resetUpdateValues = async (key, dealer) => {
    setUpdateDealer(Array.from({ length: dealersLength }).map(() => false));
    setShowUpdateDealerConfirm(false);

    refCommissionBase[key].current.classList.add("d-none");
    refCommissionDerived[key].current.classList.add("d-none");
    refPartnerSection[key].current.classList.add("d-none");
    refCommissionPartner[key].current.classList.add("d-none");
    refDealerDerived[key].current.classList.add("d-none");
    setValuesForUpdate({});
    setErrorMessage("");
    // const forceUpdate = useCallback(() => updateState({}), []);
    // refCommissionBase[key].current.value = dealer.baseCommissionRate;
    // refCommissionDerived[key].current.value = dealer.aboveCommissionRate;
    // // refPartnerSection[key].current.value = dealer.section;
    // refCommissionPartner[key].current.value = dealer.partnerCommissionRate;
    // // refDealerDerived[key].current.value = dealer.dealerAbove.name;
  };

  const handleCancelUpdate = (key, dealer) => {
    resetUpdateValues(key, dealer);
  };

  if (dealers) {
    tableHead = (
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Base Commission Rate</th>
        <th>Derived Commission Rate</th>
        <th>Partnership Section</th>
        <th>Section Commission Rate</th>
        <th>Dealer Derived</th>
      </tr>
    );

    tableBody = dealers.map((dealer, i) => {
      return (
        <tr key={dealer.id}>
          <td>{++i}</td>
          <td>{dealer.name}</td>
          <td className="">
            {updateDealer[i - 1] ? null : dealer.baseCommissionRate + "%"}{" "}
            <Form.Control
              style={{ width: "5rem", textAlign: "center" }}
              id={"baseCommissionRate"}
              ref={refCommissionBase[i - 1]}
              className="d-none mx-auto"
              type="number"
              defaultValue={dealer.baseCommissionRate}
              onChange={(event) => handleUpdateChange(event, i - 1)}
            />
          </td>
          <td>
            {updateDealer[i - 1]
              ? null
              : dealer.aboveCommissionRate
              ? dealer.aboveCommissionRate + "%"
              : "-"}
            <Form.Control
              style={{ width: "5rem", textAlign: "center" }}
              id={"aboveCommissionRate"}
              ref={refCommissionDerived[i - 1]}
              className="d-none mx-auto"
              type="number"
              defaultValue={dealer.aboveCommissionRate}
              onChange={(event) => handleUpdateChange(event, i - 1)}
            />
          </td>
          <td>
            {updateDealer[i - 1] ? null : dealer.section ? dealer.section : "-"}
            <Form.Control
              id={"section"}
              onChange={(event) => handleUpdateChange(event, i - 1)}
              as="select"
              className="d-none"
              ref={refPartnerSection[i - 1]}
            >
              {SECTIONS.map((section) => {
                if (dealer.section === section) {
                  return <option selected>{section}</option>;
                }
                return <option>{section}</option>;
              })}
            </Form.Control>
          </td>
          <td>
            {updateDealer[i - 1]
              ? null
              : dealer.partnerCommissionRate
              ? dealer.partnerCommissionRate + "%"
              : "-"}
            <Form.Control
              id={"partnerCommissionRate"}
              style={{ width: "5rem", textAlign: "center" }}
              ref={refCommissionPartner[i - 1]}
              className="d-none mx-auto"
              type="number"
              defaultValue={dealer.partnerCommissionRate}
              onChange={(event) => handleUpdateChange(event, i - 1)}
            />
          </td>
          <td>
            {updateDealer[i - 1]
              ? null
              : dealer.dealerAbove
              ? dealer.dealerAbove.name
              : "-"}
            <Form.Control
              id={"dealerAbove"}
              ref={refDealerDerived[i - 1]}
              className="d-none mx-auto"
              onChange={(event) => handleUpdateChange(event, i - 1)}
              as="select"
            >
              <option>NONE</option>
              {dealers.map((dealerItem) => {
                if (
                  dealer.dealerAbove &&
                  dealer.dealerAbove.name === dealerItem.name
                ) {
                  return (
                    <option key={dealerItem.id} selected>
                      {dealerItem.name}
                    </option>
                  );
                }
                if (!(dealer.name === dealerItem.name)) {
                  if (
                    dealerItem.dealerAbove &&
                    dealerItem.dealerAbove.name === dealer.name
                  ) {
                    return null;
                  }
                  return <option key={dealerItem.id}>{dealerItem.name}</option>;
                }
              })}
            </Form.Control>
          </td>
          <td>
            {showUpdateDealerConfirm && updateDealer[i - 1] ? (
              <>
                <div className="mt-1">
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltipConfirmUpdate}
                  >
                    <button
                      className="icon-button"
                      onClick={() =>
                        updateDealerOnConfirmTable(
                          valuesForUpdate,
                          i - 1,
                          dealer
                        )
                      }
                    >
                      <FontAwesomeIcon
                        size={"lg"}
                        icon={faCheckCircle}
                        style={{ color: "green" }}
                      />
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltipCancelUpdate}
                  >
                    <button
                      className="icon-button"
                      onClick={() => handleCancelUpdate(i - 1, dealer)}
                    >
                      <FontAwesomeIcon
                        icon={faBan}
                        size={"lg"}
                        style={{ color: "red" }}
                      />
                    </button>
                  </OverlayTrigger>
                </div>
              </>
            ) : showUpdateDealerConfirm && !updateDealer[i - 1] ? null : (
              <>
                <OverlayTrigger placement="top" overlay={renderTooltipDelete}>
                  <button
                    className="icon-button"
                    onClick={() => showConfirmDialogState(dealer.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      style={{ color: "red" }}
                    />
                  </button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={renderTooltipUpdate}>
                  <button
                    className="icon-button"
                    onClick={() => handleUpdateDealer(i - 1, dealer)}
                  >
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      style={{ color: "blue" }}
                    />
                  </button>
                </OverlayTrigger>
              </>
            )}
          </td>
        </tr>
      );
    });
  } else if (deals) {
    tableHead = (
      <tr>
        <th>#</th>
        <th onClick={() => sortDeals("date")} className="hover-filter">
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Date
        </th>
        <th onClick={() => sortDeals("invoiceNumber")} className="hover-filter">
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Invoice Number
        </th>
        <th onClick={() => sortDeals("customer")} className="hover-filter">
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Customer
        </th>
        <th onClick={() => sortDeals("state")} className="hover-filter">
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Country
        </th>
        <th onClick={() => sortDeals("dealValue")} className="hover-filter">
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Deal Amount
        </th>
        <th onClick={() => sortDeals("dealCost")} className="hover-filter">
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Deal Cost
        </th>
        <th
          onClick={() => sortDeals("dealProductsSection")}
          className="hover-filter"
        >
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Section
        </th>
        <th onClick={() => sortDeals("name")} className="hover-filter">
          <FontAwesomeIcon icon={faSort} className="mr-1" />
          Dealer
        </th>
      </tr>
    );

    tableBody = deals.map((deal, i) => {
      return (
        <tr key={deal.id}>
          <td>{++i}</td>
          <td>{deal.date}</td>
          <td>{deal.invoiceNumber}</td>
          <td>{deal.customer}</td>
          <td>{deal.state}</td>
          <td>
            {currencySwitch(deal.dealValue, deal.currentDollarValue)}{" "}
            {currency === SHEKEL_SIGN ? (
              <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                ({deal.currentDollarValue.toFixed(3)})
              </p>
            ) : null}
          </td>
          <td>{currencySwitch(deal.dealCost, deal.currentDollarValue)}</td>
          <td>{deal.dealProductsSection}</td>
          <td>{deal.dealer ? deal.dealer.name : "-"}</td>
          <td>
            <OverlayTrigger placement="top" overlay={renderTooltipDelete}>
              <button
                onClick={() => showConfirmDialogState(deal.id)}
                className="icon-button"
              >
                <FontAwesomeIcon icon={faTrashAlt} style={{ color: "red" }} />
              </button>
            </OverlayTrigger>
          </td>
        </tr>
      );
    });
  }

  const showConfirmDialogState = (itemId) => {
    deals ? setDealForDelete(itemId) : setDealerForDelete(itemId);

    setShowConfirmDialog(true);
  };

  const deleteDealHandler = (itemForDelete) => {
    deals ? setDealForDelete(itemForDelete) : setDealerForDelete(itemForDelete);
    setShowConfirmDialog(false);
    deleteDeal(dealForDelete);
  };

  const deleteDealerHandler = (dealerForDelete) => {
    setShowConfirmDialog(false);
    deleteDealer(dealerForDelete);
  };

  const handleCloase = () => {
    setShowConfirmDialog(false);
  };

  let confirm;

  if (deals) {
    confirm = (
      <ConfirmDialog
        show={showConfirmDialog}
        handleSubmit={() => deleteDealHandler(dealForDelete)}
        handleClose={handleCloase}
      />
    );
  } else {
    confirm = (
      <ConfirmDialog
        show={showConfirmDialog}
        handleSubmit={() => deleteDealerHandler(dealerForDelete)}
        handleClose={handleCloase}
      />
    );
  }

  return (
    <>
      {confirm}
      {errorMessage.length > 0 ? (
        <Container>
          <Alert
            dismissible
            transition={"fade"}
            variant={"danger"}
            style={{ maxWidth: "40rem" }}
            className="mx-auto text-center"
          >
            {errorMessage}
          </Alert>
        </Container>
      ) : null}

      <Table striped bordered hover className="text-center">
        <thead>{tableHead}</thead>
        <tbody>{tableBody}</tbody>
      </Table>
    </>
  );
};

export default TableComponent;
