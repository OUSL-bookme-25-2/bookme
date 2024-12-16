import React, { useEffect, useState } from "react";
import axios from "axios";
import Hall from "../components/Hall"; // Import the Hall component
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function Homescreen() {
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [fromdate, setfromdate] = useState('');
    const [todate, settodate] = useState('');
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
            // Log the moment objects to verify if they are correct
            console.log('Selected Dates:', dates[0], dates[1]);

            // Check if the moment objects are valid
            if (dates[0].isValid() && dates[1].isValid()) {
                // Format both dates as strings in 'DD-MM-YYYY' format
                const formattedFromDate = dates[0].format('DD-MM-YYYY');
                const formattedToDate = dates[1].format('DD-MM-YYYY');

                // Log the formatted dates to verify correctness
                console.log('Formatted Dates:', formattedFromDate, formattedToDate);

                // Set state with formatted dates
                setfromdate(formattedFromDate);
                settodate(formattedToDate);

                var temphalls = []
                var availability = false

                for (const hall of duplicatehalls) {
                    if (hall.currentBookings.length > 0) {

                        for (const booking of hall.currentBookings) {

                            if (!moment(moment(dates[0].format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate))
                                && !moment(moment(dates[1].format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate))
                            ) {
                                if (

                                    moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
                                    moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
                                    moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
                                    moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
                                ) {

                                    availability = true
                                }
                            }
                        }
                    }

                    if (availability == true || hall.currentBookings.length == 0) {
                        temphalls.push(hall)
                    }

                    setHalls(temphalls)
                }
            } else {
                console.error('Invalid date(s) selected');
            }
        }
    }




    // Log the selected dates to check if they update properly
    useEffect(() => {
        console.log("Selected fromdate:", fromdate);
        console.log("Selected todate:", todate);
    }, [fromdate, todate]);

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-3">
                    <RangePicker
                        format='DD-MM-YYYY'
                        onChange={filterByDate} // Handle the date selection
                    />
                </div>
            </div>
            <div className="row justify-content-center mt-5">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Error message={error} />
                ) : halls.length > 0 ? (
                    halls.map((hall, index) => (
                        <div key={index} className="col-md-4">
                            {/* Pass hall data along with selected dates */}
                            <Hall
                                hall={hall}
                                fromdate={fromdate}
                                todate={todate}
                            />
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
