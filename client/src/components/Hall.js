import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Hall({ hall, fromdate, todate }) { // Accept fromdate and todate as props
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="row bs">
            <div className="col-md-4">
                <img src={hall.imageUrls[0]} className="smallimg" alt={hall.name} />
            </div>
            <div className="col-md-7">
                <h1>{hall.name}</h1>
                <b>
                    <p>Max Count: {hall.maxCount}</p>
                    <p>Phone Number: {hall.PhoneNumber}</p>
                    <p>Type: {hall.type}</p>
                </b>

                <div style={{ float: "right" }}>

                    {(fromdate && todate) && (
                        <Link to={`/booking/${hall._id}/${fromdate}/${todate}`}>
                            {/* Include fromdate and todate in the URL */}
                            <button className="btn btn-primary m-2">Book Now</button>
                        </Link>

                    )}
                    
                    <button className="btn btn-primary" onClick={handleShow}>
                        View Details
                    </button>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>{hall.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        {hall.imageUrls.map((url, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100 bigimg"
                                    src={url}
                                    alt={`Slide ${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <p>{hall.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Hall;
