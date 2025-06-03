import { useState } from "react";
import axios from "axios";

export default function LoginModal({ onClose, onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("https://localhost:7121/api/Auth/Login", {
                email,
                password,
            });
            onSuccess(res.data.token); // Pass token to parent
            onClose();
        } catch (err) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-xl p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-between">
                    <button
                        onClick={handleLogin}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
