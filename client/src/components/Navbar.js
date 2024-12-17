import React, { useEffect, useState } from 'react';

function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setUser(currentUser);
    }, []);

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#343a40' }}>
                <a className="navbar-brand text-white" href="#">Bookme</a>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon">
                        <i className="fa-solid fa-bars" style={{ color: 'white' }}></i>
                    </span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        {user ? (
                            <div className="dropdown">
                                <button 
                                    className="btn btn-secondary dropdown-toggle" 
                                    type="button" 
                                    id="dropdownMenuButton" 
                                    data-toggle="dropdown" 
                                    aria-haspopup="true" 
                                    aria-expanded="false">
                                    {user.name}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" href="/profile">Profile</a>
                                    <a className="dropdown-item" href="#" onClick={logout}>Logout</a>
                                </div>
                            </div>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="/register">Register</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="/login">Login</a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
