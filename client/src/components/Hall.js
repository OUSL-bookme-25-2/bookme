import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Hall({ hall, fromdate, todate }) { // Accept fromdate and todate as props
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="card mb-4 shadow-sm" style={{ height: '100%' }}>
            <div className="card-body d-flex">
                <div className="col-md-6 p-0">
                    <img src={hall.imageUrls[0]} className="img-fluid" alt={hall.name} style={{ height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                    <div className="text-center mb-3">
                        <h5 className="card-title">{hall.name}</h5>
                        <p className="card-text">
                            <b>Max Count:</b> {hall.maxCount}<br />
                            <b>Phone Number:</b> {hall.phoneNumber}<br />
                            <b>Type:</b> {hall.type}
                        </p>
                    </div>
                    <div className="d-flex justify-content-center">
                        {(fromdate && todate) && (
                            <Link to={`/booking/${hall._id}/${fromdate}/${todate}`}>
                                {/* Include fromdate and todate in the URL */}
                                <button className="btn btn-primary m-2">Book Now</button>
                            </Link>
                        )}
                        <button className="btn btn-secondary m-2" onClick={handleShow}>
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{hall.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel indicators={false} nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />} prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}>
                        {hall.imageUrls.map((url, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={url}
                                    alt={`Slide ${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <p className="mt-3">{hall.description}</p>
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
