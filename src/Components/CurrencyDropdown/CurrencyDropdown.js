import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const CurrencyDropdown = ({ handleCurrency }) => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";

  return (
    <>
      <DropdownButton
        id="dropdown-item-button"
        title="Currency"
        size="sm"
        variant=""
      >
        <Dropdown.Item as="button" onClick={() => handleCurrency(DOLLAR_SIGN)}>
          {DOLLAR_SIGN} USD Dollar
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => handleCurrency(SHEKEL_SIGN)}>
          {SHEKEL_SIGN} ISR NIS
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
};

export default CurrencyDropdown;
