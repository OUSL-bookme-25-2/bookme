import React, { useState } from 'react';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import axios from 'axios';

function Registerscreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    async function register() {
        if (!name || !email || !password || !cpassword) {
            alert('All fields are required.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Invalid email format.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        if (password !== cpassword) {
            alert('Passwords do not match.');
            return;
        }

        const user = { name, email, password };

        try {
            setLoading(true);
            setError(false); // Clear error state
            const response = await axios.post('/api/users/register', user);
            console.log('Registration successful:', response.data);
            setLoading(false);
            setSuccess(true);

            setName('');
            setEmail('');
            setPassword('');
            setCpassword('');
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            setLoading(false);
            setError(true);
            setSuccess(false); // Clear success state
        }
    }

    return (
        <div>
            {loading && <Loader />}
            <div className="row justify-content-center mt-5">
                <div className="col-md-5 mt-5">
                    {error && <Error message="Registration failed. Please try again." />}
                    {success && <Success message="Registration Successful!" />}
                    <div className="boxshadow p-4">
                        <h2>Register</h2>
                        <input
                            type="text"
                            className="form-control mt-3"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            className="form-control mt-3"
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
                        <input
                            type="password"
                            className="form-control mt-3"
                            placeholder="Confirm Password"
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                        />
                        <button
                            className="btn btn-primary mt-3"
                            onClick={register}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registerscreen;
