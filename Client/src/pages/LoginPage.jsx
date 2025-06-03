import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFormValid = isValidEmail && password.trim().length > 0;

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("https://localhost:7121/api/Auth/Login", {
                email,
                password,
            });

            const { token, email: userEmail, role } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("role", role);

            navigate("/");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-start justify-center min-h-screen bg-[#0a1c50] px-4 mt-10 sm:mt-20">
            <div className="bg-white text-black rounded-2xl shadow-xl w-full max-w-lg p-10">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#0a1c50]">Login to Your Account</h2>

                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className={`w-full mt-1 px-4 py-3 border rounded-lg transition ${email && !isValidEmail
                                    ? "border-red-500 border-2 focus:outline-none"
                                    : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                }`}
                        />

                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={handleLogin}
                            disabled={!isFormValid || loading}
                            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center ${isFormValid && !loading
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                                }`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate("/")}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Cancel and return to home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
