import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSignin = async (e) => {
        e.preventDefault();
        setError('');

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            // Call the admin login API
            const { data } = await axios.post('http://localhost:5000/api/auth/adminlogin', { email, password }, config);

            console.log('Logged in successfully');
            localStorage.setItem('authToken', data.token); // Store JWT token

            // Fetch department after successful login
            const profileRes = await axios.get('http://localhost:5000/api/auth/admin-profile', {
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            });

            const department = profileRes.data.admin.department;
            console.log('Department:', department);

            // Store department in localStorage (optional)
            localStorage.setItem('department', department);

            // Navigate to the Dashboard
            navigate('/dashboard', { replace: true });

        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Invalid credentials');
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div className="w-full mx-auto p-6">
            <div className="mt-7 sm:w-[25rem] w-[21rem] bg-white border border-gray-200 rounded-xl shadow-sm mx-auto shrink-none">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800">Admin Login</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account yet?
                            <a className="text-blue-600 decoration-2 hover:underline font-medium mx-1" href="/signup">
                                Sign up here
                            </a>
                        </p>
                    </div>

                    <div className="mt-5">
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <form onSubmit={handleSignin}>
                            <div className="grid gap-y-4">
                                <div>
                                    <label className="block text-sm mb-2">Email address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
