import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://localhost:7121/api/Exchange";

export default function ChartsDisplay() {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/AllRates`)
            .then(res => {
                setRates(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load conversion rates:", err);
                setLoading(false);
            });
    }, []);

    const getFlag = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <svg
                    className="animate-spin h-8 w-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#0a1c50] mb-6 text-center">
                All Currency Conversion Rates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {rates.map((rate, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 hover:shadow-md transition flex sm:block sm:text-center items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-0"
                    >
                        <div className="flex items-center gap-2 sm:justify-center sm:mb-2 sm:mt-1 w-full">
                            <img src={getFlag(rate.fromCountry)} alt={rate.from} className="w-5 h-5 rounded-full" />
                            <span className="font-semibold text-sm">{rate.from}</span>
                            <span className="text-gray-400">→</span>
                            <img src={getFlag(rate.toCountry)} alt={rate.to} className="w-5 h-5 rounded-full" />
                            <span className="font-semibold text-sm">{rate.to}</span>
                        </div>
                        <span className="text-blue-600 font-medium text-sm sm:block sm:mt-1 ml-auto sm:ml-0">
                            {parseFloat(rate.rate).toString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
