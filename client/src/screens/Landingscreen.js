import React from 'react'
import { Link } from 'react-router-dom'


function Landingscreen() {
    return(
        <div className='row landing justify-content-center'>

            <div className="col-md-9 my-auto" style={{borderRight: '5px solid white'}}>
                <h1 style={{color: 'white' , fontSize:'130px'}}>Bookme</h1>
                <h2 style={{color: 'white'}}>Book Halls For Your Events</h2>

                <Link to='/home'>
                    <button className='btn mt-5' style={{color: 'black', backgroundColor: 'white'}}>Get Started</button>
                </Link>
                
            </div>
        </div>
    )
}

export default Landingscreen