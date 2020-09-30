import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCalculator,
  faChartPie,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";

const Sidebar = (props) => {
  const [showSideMenuClick, setShowSideMenuClick] = useState(true);

  const handleShowSideOnClick = () => {
    setShowSideMenuClick(false);
  };
  return (
    <>
      <Navbar
        className="col-md-12 d-none d-md-block bg-light sidebar"
        activeKey="/home"
        onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        bg="light"
        variant="dark"
      >
        <div className="sidebar-sticky"></div>
        <Navbar.Brand as={Link} to="/" className="">
          <div className="pt-3 pl-2 text-dark d-flex">
            <FontAwesomeIcon size="lg" icon={faChartLine} />
            <h4 className="ml-2 text-center text-dark">DASHBOARD</h4>
          </div>
        </Navbar.Brand>
        <hr className="m-1" />
        <div className="d-flex ml-2 mt-5">
          <Dropdown drop={"right"}>
            <Dropdown.Toggle
              variant=""
              style={{ letterSpacing: "3px" }}
              className="hover-link"
            >
              <FontAwesomeIcon
                size={"lg"}
                icon={faCalculator}
                className="mr-3"
              />
              COMMISSIONS
            </Dropdown.Toggle>
            {/* <Nav.Link as={Link} to="/commissions">
          Commissions
        </Nav.Link> */}
            <Dropdown.Menu>
              <Nav.Link
                as={Link}
                to="/commissions"
                className="text-dark ml-3 hover-link"
              >
                For Dealer
              </Nav.Link>

              <Dropdown.Divider />
              <Nav.Link
                as={Link}
                to="/commissions"
                className="text-dark ml-3 hover-link"
              >
                Custom
              </Nav.Link>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-flex ml-2 mt-4">
          <Dropdown drop={"right"}>
            <Dropdown.Toggle
              variant=""
              style={{ letterSpacing: "3px" }}
              className="hover-link"
            >
              <FontAwesomeIcon size={"lg"} icon={faChartPie} className="mr-3" />
              STATISTICS
            </Dropdown.Toggle>
            {/* <Nav.Link as={Link} to="/commissions">
          Commissions
        </Nav.Link> */}
            <Dropdown.Menu>
              <Nav.Link
                as={Link}
                to="/margins"
                className="text-dark ml-3 hover-link"
              >
                Margins
              </Nav.Link>
              {/* <Dropdown.Divider /> */}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-flex ml-2 mt-4">
          <Dropdown drop={"right"}>
            <Dropdown.Toggle
              variant=""
              style={{ letterSpacing: "3px" }}
              className="hover-link"
            >
              <FontAwesomeIcon
                size={"lg"}
                icon={faCalendarAlt}
                className="mr-3"
              />
              CRM
            </Dropdown.Toggle>
            {/* <Nav.Link as={Link} to="/commissions">
          Commissions
        </Nav.Link> */}
            <Dropdown.Menu>
              <Nav.Link as={Link} to="/" className="text-dark ml-3 hover-link">
                Leads
              </Nav.Link>
              {/* <Dropdown.Divider /> */}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Navbar>
    </>
  );
};

export default Sidebar;
