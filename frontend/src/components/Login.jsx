import React, { useState } from "react";

const Login = ({ isLoggedIn, setIsLoggedIn }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

    const togglePopup = () => setShowPopup(!showPopup);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            setToken(data.token); // Сохраняем токен
            localStorage.setItem("authToken", data.token); // Сохраняем токен
            setIsLoggedIn(true);
            setError("");
            setShowPopup(false);
            console.log("Logged in successfully:", data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:4001/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const data = await response.json();
            setError("");
            console.log("Registered successfully:", data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
    };

    return (
        <div className="relative">
            <div
                className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center text-white font-semibold text-lg shadow-lg transform hover:scale-105 transition duration-200"
                onClick={togglePopup}
            >
                U
            </div>
            {showPopup && (
                <div className="absolute right-0 top-14 bg-white shadow-lg p-6 rounded-xl w-80 max-w-sm border border-gray-200 transition-all transform scale-95 hover:scale-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">Login</h2>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 mt-4"
                        >
                            Login
                        </button>
                    </form>

                    <button
                        onClick={handleRegister}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 mt-3"
                    >
                        Register
                    </button>

                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 mt-3"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Login;
