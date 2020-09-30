import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FormControl from "react-bootstrap/FormControl";

const DealForm = ({ handleClose, handleSubmit }) => {
  const SHEKEL_SIGN = "₪";
  const DOLLAR_SIGN = "$";
  const [dealers, setDealers] = useState([]);
  const [values, setValues] = useState({ dealProductsSection: "COSMETICS" });
  const [currency, setCurrency] = useState(DOLLAR_SIGN);
  const [currentDollarValueState, setCurrentDollarValueState] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const dealers_url = "http://localhost:8080/dealers/dealers_all";
        const rate_url =
          "https://api.exchangeratesapi.io/latest?base=USD&symbols=ILS";

        const dealersResponse = await fetch(dealers_url);
        const dealersData = await dealersResponse.json();
        setDealers(dealersData);

        const rateResponse = await fetch(rate_url);
        const rateData = await rateResponse.json();
        setCurrentDollarValueState(Number(rateData.rates.ILS));

        setValues({
          ...values,
          dealer: dealersData[0],
          currentDollarValue: Number(rateData.rates.ILS)
        });
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
      // ...
    }

    fetchData();
  }, []);

  const handleOnChange = (event) => {
    let value = event.target.value;
    if (event.target.id === "dealer") {
      value = dealers.find((dealer) => dealer.name === value);
    }
    if (event.target.id === "currency") {
      setCurrency(value);
      return;
    }
    if (event.target.id === "dealValue" || event.target.id === "dealCost") {
      if (currency === SHEKEL_SIGN) {
        value = value / currentDollarValueState;
      }
    }
    setValues({ ...values, [event.target.id]: value });
  };

  const validate = () => {
    let input = { ...values };
    let errors = {};
    let isValid = true;

    if (input["invoiceNumber"] <= 0) {
      isValid = false;
      errors["invoiceNumber"] = "Please enter valid number.";
    }

    if (input["dealValue"] <= 0) {
      isValid = false;
      errors["dealValue"] = "Please enter a valid value.";
    }

    if (input["dealCost"] <= 0) {
      isValid = false;
      errors["dealCost"] = "Please enter a valid cost.";
    }

    setErrors(errors);

    return isValid;
  };

  const handleSubmitValidation = (event, values) => {
    event.preventDefault();

    if (validate()) {
      handleSubmit(event, values);
    }
  };

  return (
    <Form onSubmit={() => handleSubmitValidation(event, values)}>
      <Form.Row>
        <Form.Group as={Col} controlId="customer">
          <Form.Label>
            Customer<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            onChange={handleOnChange}
            placeholder="Enter Customer"
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="invoiceNumber">
          <Form.Label>
            Invoice Number<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            onChange={handleOnChange}
            type="number"
            placeholder="Invoice Number"
            isInvalid={"invoiceNumber" in errors}
            required
          />
          <FormControl.Feedback type="invalid">
            {errors.invoiceNumber}
          </FormControl.Feedback>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} xs={6} controlId="state">
          <Form.Label>
            Country<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            onChange={handleOnChange}
            placeholder="Enter Country"
            required
          />
        </Form.Group>
        <Form.Group as={Col} xs={6} controlId="dealer">
          <Form.Label>
            Dealer<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control required onChange={handleOnChange} as="select">
            {dealers.map((dealer) => {
              return <option key={dealer.id}>{dealer.name}</option>;
            })}
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} xs={2} controlId="currency">
          <Form.Label>Currency</Form.Label>
          <Form.Control required onChange={handleOnChange} as="select">
            <option>{DOLLAR_SIGN}</option>
            <option>{SHEKEL_SIGN}</option>
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="dealValue">
          <Form.Label>
            Deal Value<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            onChange={handleOnChange}
            type="number"
            placeholder="Deal Value"
            isInvalid={"dealValue" in errors}
            required
          />
          <FormControl.Feedback type="invalid">
            {errors.dealValue}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group as={Col} controlId="dealCost">
          <Form.Label>
            Deal Cost<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            onChange={handleOnChange}
            type="number"
            placeholder="Deal Cost"
            isInvalid={"dealCost" in errors}
            required
          />
          <FormControl.Feedback type="invalid">
            {errors.dealCost}
          </FormControl.Feedback>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="dealProductsSection">
          <Form.Label>
            Deal Section<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control required onChange={handleOnChange} as="select">
            <option>COSMETICS</option>
            <option>INDUSTRY</option>
            <option>AVIATION</option>
            <option>RAIL</option>
            <option>SPECIAL</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="date">
          <Form.Label>
            Date<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="date"
            className="mr-sm-2 ml-sm-2"
            onChange={handleOnChange}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Text>
        <span style={{ color: "red" }}>*</span> Required
      </Form.Text>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default DealForm;
