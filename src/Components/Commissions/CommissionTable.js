import React from "react";
import { Table } from "react-bootstrap";

const CommissionTable = ({ headers, commissions, type, currency }) => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  let tableContent;

  function getFormattedCurrency(num) {
    num = num.toFixed(2);
    var cents = (num - Math.floor(num)).toFixed(2);
    return Math.floor(num).toLocaleString() + "." + cents.split(".")[1];
  }

  const currencySwitch = (value, rate) => {
    if (currency === DOLLAR_SIGN) {
      return DOLLAR_SIGN + getFormattedCurrency(value);
    }

    return SHEKEL_SIGN + getFormattedCurrency(value * rate);
  };

  switch (type) {
    case "DIRECT":
      tableContent = commissions.map((commission, i) => {
        return (
          <tr key={commission.id}>
            <td>{i + 1}</td>
            <td>{commission.deal.date}</td>
            <td>{commission.deal.customer}</td>
            <td>{commission.deal.state}</td>
            <td>{commission.deal.invoiceNumber}</td>
            <td>
              {currencySwitch(
                commission.deal.dealValue,
                commission.deal.currentDollarValue
              )}{" "}
              {currency === SHEKEL_SIGN ? (
                <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                  ({commission.deal.currentDollarValue.toFixed(3)})
                </p>
              ) : null}
            </td>
            <td>
              {currencySwitch(
                commission.deal.dealCost,
                commission.deal.currentDollarValue
              )}
            </td>
            <td>{commission.dealer.name}</td>
            <td>{commission.dealerCommissionRate}%</td>
            <td>
              {currencySwitch(
                commission.dealCommissionAmountForDealer,
                commission.deal.currentDollarValue
              )}
            </td>
          </tr>
        );
      });
      break;
    case "DERIVED":
      tableContent = commissions.map((commission, i) => {
        return (
          <tr key={commission.id}>
            <td>{i + 1}</td>
            <td>{commission.deal.date}</td>
            <td>{commission.deal.customer}</td>
            <td>{commission.deal.state}</td>
            <td>{commission.deal.invoiceNumber}</td>
            <td>
              {currencySwitch(
                commission.deal.dealValue,
                commission.deal.currentDollarValue
              )}
              {currency === SHEKEL_SIGN ? (
                <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                  ({commission.deal.currentDollarValue.toFixed(3)})
                </p>
              ) : null}
            </td>
            <td>{commission.deal.dealer.name}</td>
            <td>{commission.deal.dealer.baseCommissionRate}%</td>
            <td>
              {currencySwitch(
                (commission.deal.dealValue *
                  commission.deal.dealer.baseCommissionRate) /
                  100,
                commission.deal.currentDollarValue
              )}
            </td>
            <td>{commission.dealer.name}</td>
            <td>{commission.dealerCommissionRate}%</td>
            <td>
              {currencySwitch(
                commission.dealCommissionAmountForDealer,
                commission.deal.currentDollarValue
              )}
            </td>
          </tr>
        );
      });
      break;
    case "PARTNER":
      tableContent = commissions.map((commission, i) => {
        return (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{commission.deal.date}</td>
            <td>{commission.deal.customer}</td>
            <td>{commission.deal.state}</td>
            <td>{commission.deal.invoiceNumber}</td>
            <td>
              {currencySwitch(
                commission.deal.dealValue,
                commission.deal.currentDollarValue
              )}
              {currency === SHEKEL_SIGN ? (
                <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                  ({commission.deal.currentDollarValue.toFixed(3)})
                </p>
              ) : null}
            </td>
            <td>
              {currencySwitch(
                commission.deal.dealCost,
                commission.deal.currentDollarValue
              )}
            </td>
            <td>{commission.deal.dealer.name}</td>
            <td>{commission.dealer.name}</td>
            <td>{commission.dealerCommissionRate}%</td>
            <td>
              {currencySwitch(
                commission.dealCommissionAmountForDealer,
                commission.deal.currentDollarValue
              )}
            </td>
          </tr>
        );
      });
      break;
    default:
  }

  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          {headers.map((header) => {
            return <th>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </Table>
  );
};

export default CommissionTable;
