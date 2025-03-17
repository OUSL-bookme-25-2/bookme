import React, { useEffect, useState } from "react";
import axios from "axios";
import Hall from "../components/Hall"; 
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";   //moment.js library to simplify the dates
import { DatePicker, Space } from "antd";
import "antd/dist/reset.css";   //antd date range picker css import


const { RangePicker } = DatePicker;

function Homescreen() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromdate, setfromdate] = useState("");
  const [todate, settodate] = useState("");
  const [duplicatehalls, setduplicatehalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/halls/getallHalls");
        setHalls(data);
        setLoading(false);
        setduplicatehalls(data);
      } catch (err) {
        setError("Failed to fetch halls");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates) {
    if (dates && dates.length === 2) {
      console.log("Selected Dates:", dates[0].format("DD-MM-YYYY"), dates[1].format("DD-MM-YYYY"));
  
      if (dates[0].isValid() && dates[1].isValid()) {
        const formattedFromDate = dates[0].format("DD-MM-YYYY");
        const formattedToDate = dates[1].format("DD-MM-YYYY");
  
        console.log("Formatted Dates:", formattedFromDate, formattedToDate);
  
        setfromdate(formattedFromDate);
        settodate(formattedToDate);
  
        const availableHalls = duplicatehalls.filter((hall) => {
          let isAvailable = true;
  
          for (const booking of hall.currentBookings) {
            const bookingStart = moment(booking.fromdate, "DD-MM-YYYY");
            const bookingEnd = moment(booking.todate, "DD-MM-YYYY");
            const selectedStart = moment(formattedFromDate, "DD-MM-YYYY");
            const selectedEnd = moment(formattedToDate, "DD-MM-YYYY");
  
            // Check if there is an overlap between the selected date range and existing bookings
            if (
              selectedStart.isBetween(bookingStart, bookingEnd, null, "[]") ||
              selectedEnd.isBetween(bookingStart, bookingEnd, null, "[]") ||
              bookingStart.isBetween(selectedStart, selectedEnd, null, "[]") ||
              bookingEnd.isBetween(selectedStart, selectedEnd, null, "[]")
            ) {
              isAvailable = false;
              break; // No need to check further, hall is already booked
            }
          }
  
          return isAvailable;
        });
  
        setHalls(availableHalls);
      } else {
        console.error("Invalid date(s) selected");
      }
    }
  }
  

  useEffect(() => {
    console.log("Selected fromdate:", fromdate);
    console.log("Selected todate:", todate);
  }, [fromdate, todate]);

  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 >Find the Perfect Hall for Your Event</h1>
        <p >
          Book the right space for weddings, meetings, and more.
        </p>
      </div>

      {/* Date Picker Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="date-picker-container p-4 shadow-sm rounded" style={{ backgroundColor: 'black' }}>
            <h4 className="text-center mb-3" style={{ color: 'white' }}>Select Dates to Check Availability</h4>
            <RangePicker 
              format="DD-MM-YYYY"
              onChange={filterByDate}
              className="range-picker"
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
            />
          </div>
        </div>
      </div>

      {/* Hall Details Section */}
      <div className="row justify-content-center">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error message={error} />
        ) : halls.length > 0 ? (
          halls.map((hall, index) => (
            <div key={index} className="col-12 mb-4" >
              <div className="hall-card shadow-sm rounded" style={{ height: '80%'}}>
                <Hall hall={hall} fromdate={fromdate} todate={todate} />
              </div>
            </div>
          ))
        ) : (
          <Error message="No halls found!" />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
