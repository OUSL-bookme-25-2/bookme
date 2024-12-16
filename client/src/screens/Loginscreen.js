import React, { useState } from 'react';
import Loader from "../components/Loader";
import Error from "../components/Error";
import axios from 'axios';

function Loginscreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function login() {
        if (!email || !password) {
            alert('Both email and password are required.');
            return;
        }

        const user = { email, password };

        try {
            setLoading(true);
            setError(''); // Reset error
            const response = (await axios.post('/api/users/login', user)).data;

            // Store full user details in localStorage
            localStorage.setItem('currentUser', JSON.stringify(response));

            setLoading(false);
            window.location.href = '/home';
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    }

    return (
        <div>
            {loading && <Loader />}
            <div className="row justify-content-center mt-5">
                <div className="col-md-5 mt-5">
                    {error && <Error message={error} />}
                    <div className="boxshadow p-4">
                        <h2>Login</h2>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="form-control mt-3"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="btn btn-primary mt-3"
                            onClick={login}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginscreen;
