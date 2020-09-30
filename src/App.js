import React, { Component } from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Topbar from "./Components/Topbar/Topbar";
import MainContent from "./Components/MainContent/MainContent";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Container fluid>
            <Row>
              <Col xs={2} key="sidebar-wrapper p-0">
                <Sidebar />
              </Col>
              <Col xs={10} key="page-content-wrapper">
                <Row>
                  <Topbar />
                </Row>
                <MainContent />
              </Col>
            </Row>
          </Container>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
