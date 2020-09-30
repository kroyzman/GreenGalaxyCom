import React from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RevenueCards = ({ title, content, icon, color }) => {
  return (
    <Card className="p-0 mb-3">
      <Card.Body className="d-flex flex-row-reverse  justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <p className="text-muted m-0">{title}</p>
          <p
            className="text-dark font-weight-bold"
            style={{ fontSize: "1.5rem" }}
          >
            {content}
          </p>
        </div>
        <FontAwesomeIcon size="3x" icon={icon} style={{ color: color }} />
      </Card.Body>
      <Card.Footer />
    </Card>
  );
};

export default RevenueCards;
