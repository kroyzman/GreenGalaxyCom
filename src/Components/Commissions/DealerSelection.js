import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

const DealerSelection = ({ handleCommissionsForDealer, loadingInit }) => {
  const [value, setValue] = useState("");
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data_url = "http://localhost:8080/dealers/dealers_all";

        const response = await fetch(data_url);
        const data = await response.json();
        setDealers(data);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
    }
    fetchData();
  }, []);

  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      return (
        <div ref={ref} className={className} aria-labelledby={labeledBy}>
          <Form.Control
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value)
            )}
          </ul>
        </div>
      );
    }
  );

  async function fetchDealerCommissions(dealer) {
    loadingInit();
    try {
      const data_url = "http://localhost:8080/commissions/" + dealer.id;

      const response = await fetch(data_url);
      const data = await response.json();
      handleCommissionsForDealer(data, dealer.id);
    } catch (error) {
      console.error(`fetch operation failed: ${error}`);
    }
  }

  const selectHandler = (eventKey) => {
    const dealerIndex = eventKey - 1;
    fetchDealerCommissions(dealers[dealerIndex]);
  };

  return (
    <Dropdown className="m-3 text-center">
      <Dropdown.Toggle id="dropdown-custom-components">
        Choose Dealer
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu} drop={"down"}>
        {dealers.map((dealer) => {
          return (
            <Dropdown.Item
              onSelect={selectHandler}
              key={dealer.id}
              eventKey={dealer.id}
            >
              {dealer.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DealerSelection;
