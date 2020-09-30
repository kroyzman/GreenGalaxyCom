import React, { useState, useEffect } from "react";
import Table from "../Table/TableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal/ModalComponent";
import DealerForm from "../DealerForm/DealerForm";
import ModalException from "../Modal/ExceptionModal";
import Spinner from "react-spinners/BeatLoader";
import Container from "react-bootstrap/Container";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [show, setShow] = useState(false);
  const [showException, setShowException] = useState(false);
  const [exceptionMessage, setExceptionMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);

  const handleSubmit = (event, values) => {
    event.preventDefault();
    setShow(false);
    console.log(values);
    postData(values);
  };

  async function postData(data = {}) {
    setLoading(true);
    const response = await fetch("http://localhost:8080/dealers/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const returnedDealer = await response.json();
    console.log("RETURNED DEAL " + returnedDealer);
    const newDealerList = [...dealers];
    newDealerList.push(returnedDealer);
    setDealers(newDealerList);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const data_url = "http://localhost:8080/dealers/dealers_all";

        const response = await fetch(data_url);
        const data = await response.json();
        setLoading(false);
        setDealers(data);
      } catch (error) {
        console.error(`fetch operation failed: ${error}`);
      }
      // ...
    }
    fetchData();
  }, []);

  const deleteDealer = (dealerId) => {
    setLoading(true);
    fetch(`http://localhost:8080/dealers/delete/${dealerId}`, {
      method: "DELETE"
    })
      .then((result) => {
        //Here body is not ready yet, throw promise
        if (!result.ok) throw result;
        return result.json();
      })
      .then((result) => {
        const newDealersList = [...dealers];
        newDealersList.splice(
          newDealersList.findIndex(function (item) {
            return item.id === dealerId;
          }),
          1
        );
        setLoading(false);
        setDealers(newDealersList);
      })
      .catch((error) => {
        //Here is still promise
        console.log(error);
        error.json().then((body) => {
          setLoading(false);
          //Here is already the payload from API
          setShowException(true);
          setExceptionMessage(body.message);
        });
      });
  };

  const handleCloseException = () => {
    setShowException(false);
  };

  async function updateDealerOnConfirm(dealerForUpdate) {
    console.log(dealerForUpdate);
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/dealers/update/${dealerForUpdate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dealerForUpdate)
        }
      );

      const returnedDealers = await response.json();
      await setDealers(returnedDealers);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {loading ? (
        <Container
          fluid
          className="d-flex justify-content-center align-items-center p-5 mt-5"
        >
          <Spinner size={50} color={"CadetBlue"} loading={loading} />
        </Container>
      ) : (
        <>
          <ModalException
            message={exceptionMessage}
            showProp={showException}
            handleClose={handleCloseException}
          />
          <Modal
            show={show}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            title={"DEALER"}
          >
            <DealerForm
              dealers={dealers}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
            />
          </Modal>
          <button
            onClick={() => setShow(true)}
            className="btn btn-outline-secondary btn-rounded waves-effect float-left mb-3 mt-3"
          >
            <FontAwesomeIcon icon={faPlus} /> ADD DEALER
          </button>
          <Table
            dealers={dealers}
            deleteDealer={deleteDealer}
            dealersLength={dealers.length}
            updateDealerOnConfirm={updateDealerOnConfirm}
          />
        </>
      )}
    </>
  );
};

export default Dealers;
