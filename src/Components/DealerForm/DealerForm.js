import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

const DealerForm = ({ handleClose, handleSubmit, dealers }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleOnChange = (event) => {
    let value = event.target.value;
    if (event.target.id === "dealerAbove") {
      if (value === "NONE") {
        value = null;
      } else {
        value = dealers.find((dealer) => dealer.name === value);
      }
    }
    if (event.target.id === "section") {
      if (value === "NONE") {
        value = null;
      }
    }
    setValues({ ...values, [event.target.id]: value });
  };

  const validate = () => {
    let input = { ...values };
    let errors = {};
    let isValid = true;

    if (!input["name"]) {
      isValid = false;
      errors["name"] = "Please enter dealer name.";
    }

    if (!input["baseCommissionRate"]) {
      isValid = false;
      errors["baseCommissionRate"] = "Please enter base commission.";
    }

    if (
      input["baseCommissionRate"] &&
      (input["baseCommissionRate"] <= 0 || input["baseCommissionRate"] > 100)
    ) {
      isValid = false;
      errors["baseCommissionRate"] = "Please enter commission between 1-100.";
    }

    if (!input["aboveCommissionRate"]) {
      isValid = false;
      errors["aboveCommissionRate"] = "Please enter derived commission.";
    }

    if (
      input["aboveCommissionRate"] &&
      (input["aboveCommissionRate"] <= 0 || input["aboveCommissionRate"] > 100)
    ) {
      isValid = false;
      errors["aboveCommissionRate"] = "Please enter commission between 1-100.";
    }

    if (input["section"]) {
      if (
        !input["partnerCommissionRate"] ||
        input["partnerCommissionRate"] <= 0
      ) {
        isValid = false;
        errors["section"] = "Please enter partner commission.";
      }
    }

    if (input["partnerCommissionRate"]) {
      if (!input["section"]) {
        isValid = false;
        errors["partnerCommissionRate"] = "Please enter partner section.";
      }
    }

    if (
      input["partnerCommissionRate"] &&
      (input["partnerCommissionRate"] <= 0 ||
        input["partnerCommissionRate"] > 100)
    ) {
      isValid = false;
      errors["partnerCommissionRate"] =
        "Please enter commission between 1-100.";
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
    <Form noValidate onSubmit={() => handleSubmitValidation(event, values)}>
      <Form.Row>
        <Form.Group as={Col} controlId="name">
          <Form.Label>
            Name<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            // required
            onChange={handleOnChange}
            placeholder="Enter Name"
            isInvalid={"name" in errors}
          />
          <FormControl.Feedback type="invalid">
            {errors.name}
          </FormControl.Feedback>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} xs={6} controlId="baseCommissionRate">
          <Form.Label>
            Dealer Commission<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">%</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={handleOnChange}
              type="number"
              placeholder="Commission Rate"
              isInvalid={"baseCommissionRate" in errors}
            />
            <FormControl.Feedback type="invalid">
              {errors.baseCommissionRate}
            </FormControl.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} controlId="aboveCommissionRate">
          <Form.Label>
            Dealer Derived Commission<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">%</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={handleOnChange}
              type="number"
              placeholder="Commission Rate"
              isInvalid={"aboveCommissionRate" in errors}
            />
          </InputGroup>
          <FormControl.Feedback type="invalid">
            {errors.aboveCommissionRate}
          </FormControl.Feedback>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} xs={6} controlId="dealerAbove">
          <Form.Label>Dealer Above</Form.Label>
          <Form.Control onChange={handleOnChange} as="select">
            <option>NONE</option>
            {dealers.map((dealer) => {
              return <option key={dealer.id}>{dealer.name}</option>;
            })}
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="section">
          <Form.Label>Partnership Section</Form.Label>
          <Form.Control
            onChange={handleOnChange}
            as="select"
            isInvalid={"section" in errors}
          >
            <option>NONE</option>
            <option>COSMETICS</option>
            <option>INDUSTRY</option>
            <option>AVIATION</option>
            <option>RAIL</option>
            <option>SPECIAL</option>
          </Form.Control>
          <FormControl.Feedback type="invalid">
            {errors.section}
          </FormControl.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="partnerCommissionRate">
          <Form.Label>Partnership Commission</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">%</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={handleOnChange}
              type="number"
              placeholder="Commission Rate"
              isInvalid={"partnerCommissionRate" in errors}
            />
          </InputGroup>
          <FormControl.Feedback type="invalid">
            {errors.partnerCommissionRate}
          </FormControl.Feedback>
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

export default DealerForm;
