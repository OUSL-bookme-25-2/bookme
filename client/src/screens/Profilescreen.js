import React, {  useEffect } from 'react';
import { Input, Tabs } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;

function Profilescreen() {

    const user = JSON.parse(localStorage.getItem("currentUser"))

    useEffect(() => {

        if (!user) {
            window.location.href = '/login'
        }
    }, []

    )
    return (
        <div className='ml-3 mt-3'>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile" key="1">
                    <h1>My Profile</h1>
                    <br />
                    <h1>Name : {user.name} </h1>
                    <h1>Email : {user.email} </h1>
                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <MyBookings />
                </TabPane>
            </Tabs>
        </div>
    )
}


export default Profilescreen;


export function MyBookings() {
    const user = JSON.parse(localStorage.getItem("currentUser"))

    useEffect(async () => {

        try {
            const halls = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id }).data
            console.log(halls)
        } catch (error) {
            console.log(error)
        }
    }, []

    )

    return (
        <div>
            <h1>My Bookings</h1>
        </div>
    )
}
