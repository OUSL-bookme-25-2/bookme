import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';

const { TabPane } = Tabs;

function Adminscreen() {
    return (
        <div className='mt-3 ml-3 mr-3 shadow p-3 mb-5 bg-white rounded'>
            <h1 className="text-center mb-4">Admin Panel</h1>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Bookings" key="1">
                    <Bookings />
                </TabPane>
                <TabPane tab="Halls" key="2">
                    <Halls />
                </TabPane>
                <TabPane tab="Add Hall" key="3">
                    <Addhall />
                </TabPane>
                <TabPane tab="Users" key="4">
                    <Users />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Adminscreen;

export function Bookings() {
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/bookings/getallbookings');
                setbookings(response.data);
            } catch (err) {
                console.error(err);
                seterror(err);
            } finally {
                setloading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h2 className="text-center mb-4">Bookings</h2>
                {loading && <Loader />}

                <table className='table table-bordered table-striped'>
                    <thead className="thead-dark">
                        <tr>
                            <th>Booking Id</th>
                            <th>User Id</th>
                            <th>Hall</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length && (bookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.hall}</td>
                                <td>{booking.fromdate}</td>
                                <td>{booking.todate}</td>
                                <td>{booking.status}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>

                {error && <Error message={error.message} />}
            </div>
        </div>
    );
}

// Halls component
export function Halls() {
    const [halls, sethalls] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/halls/getallHalls');
                sethalls(response.data);
            } catch (err) {
                console.error(err);
                seterror(err);
            } finally {
                setloading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h2 className="text-center mb-4">Halls</h2>
                {loading && <Loader />}

                <table className='table table-bordered table-striped'>
                    <thead className="thead-dark">
                        <tr>
                            <th>Hall Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent Per Day</th>
                            <th>Max Count</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>

                    <tbody>
                        {halls.length && (halls.map(hall => (
                            <tr key={hall._id}>
                                <td>{hall._id}</td>
                                <td>{hall.name}</td>
                                <td>{hall.type}</td>
                                <td>{hall.rentPerDay}</td>
                                <td>{hall.maxCount}</td>
                                <td>{hall.phoneNumber}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>

                {error && <Error message={error.message} />}
            </div>
        </div>
    );
}

// Users Component
export function Users() {
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/users/getallusers');
                setusers(response.data);
            } catch (err) {
                console.error(err);
                seterror(err);
            } finally {
                setloading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                <h2 className="text-center mb-4">Users</h2>
                {loading && <Loader />}
                <table className='table table-bordered table-striped'>
                    <thead className="thead-dark">
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users && (users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'Admin' : 'Customer'}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>
                {error && <Error message={error.message} />}
            </div>
        </div>
    );
}

// Add Hall component
export function Addhall() {
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(null);

    const [name, setname] = useState('');
    const [rentPerDay, setrentPerDay] = useState('');
    const [maxCount, setmaxCount] = useState('');
    const [description, setdescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [type, settype] = useState('');
    const [imageurl1, setimageurl1] = useState('');
    const [imageurl2, setimageurl2] = useState('');
    const [imageurl3, setimageurl3] = useState('');

    async function addHall() {
        const newhall = {
            name,
            rentPerDay,
            maxCount,
            description,
            phoneNumber,
            type,
            imageUrls: [imageurl1, imageurl2, imageurl3]
        };

        try {
            setloading(true);
            const result = await (await axios.post('/api/halls/addhall', newhall)).data;
            console.log(result);
            setloading(false);
            Swal.fire('Congrats', "Your New Hall Added Successfully", 'success').then(result => {
                window.location.href = '/home';
            });
        } catch (error) {
            console.log(error);
            setloading(false);
            Swal.fire('Oops', "Something went wrong", 'error');
        }
    }

    return (
        <div className='row'>
            <div className="col-md-6">
                {loading && <Loader />}
                <h2 className="text-center mb-4">Add New Hall</h2>
                <input type="text" className='form-control mb-2' placeholder='Hall name'
                    value={name} onChange={(e) => { setname(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Rent Per Day'
                    value={rentPerDay} onChange={(e) => { setrentPerDay(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Max Count'
                    value={maxCount} onChange={(e) => { setmaxCount(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Description'
                    value={description} onChange={(e) => { setdescription(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Phone Number'
                    value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Type'
                    value={type} onChange={(e) => { settype(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Image URL 1'
                    value={imageurl1} onChange={(e) => { setimageurl1(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Image URL 2'
                    value={imageurl2} onChange={(e) => { setimageurl2(e.target.value) }}
                />
                <input type="text" className='form-control mb-2' placeholder='Image URL 3'
                    value={imageurl3} onChange={(e) => { setimageurl3(e.target.value) }}
                />

                <div className="text-right">
                    <button className='btn btn-primary mt-2' onClick={addHall}>Add Hall</button>
                </div>
            </div>
        </div>
    );
}