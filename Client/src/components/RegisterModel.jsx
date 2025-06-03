import { useState } from "react";
import axios from "axios";

export default function RegisterModal({ onClose, onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const res = await axios.post("https://localhost:7121/api/Auth/Register", {
                email,
                password,
            });
            onSuccess(res.data.token); // Pass token to parent
            onClose();
        } catch (err) {
            alert("Registration failed. Try a different email.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-xl p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Register</h2>
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
                        onClick={handleRegister}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Register
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
