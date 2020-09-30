import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const DateBetweenPicker = ({ handleSubmitDates }) => {
  const [dateRangeObj, setDateRangeObj] = useState();

  const handleOnChange = (event) => {
    let value = event.target.value;

    setDateRangeObj({ ...dateRangeObj, [event.target.id]: value });
  };

  return (
    <>
      <Form
        inline
        className="mb-3"
        onSubmit={(event) => handleSubmitDates(event, dateRangeObj)}
      >
        <Form.Group controlId="start_date">
          <Form.Label>Start Date:</Form.Label>
          <Form.Control
            type="date"
            className="mr-sm-2 ml-sm-2"
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group controlId="end_date">
          <Form.Label className="ml-2">End Date:</Form.Label>
          <Form.Control
            type="date"
            className="mr-sm-2 ml-sm-2"
            onChange={handleOnChange}
          />
        </Form.Group>
        <Button type="submit" variant="secondary">
          Apply
        </Button>
      </Form>
    </>
  );
};

export default DateBetweenPicker;
