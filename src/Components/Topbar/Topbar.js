import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import logo from "../../../public/images/logo white.png";

const Topbar = () => {
  return (
    <Navbar bg="dark" variant="dark" className="w-100">
      <Navbar.Brand as={Link} to="/">
        <Image src={logo} fluid width={50} />
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/deals">
          Deals
        </Nav.Link>
        <Nav.Link as={Link} to="/dealers">
          Dealers
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Topbar;
