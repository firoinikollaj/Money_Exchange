import { useEffect, useState } from "react";
import axios from "axios";
import CurrencyDropdown from "./CurrencyDropdown";

const API_BASE = "https://localhost:7121/api/Exchange";

function HomePage() {
    const [amountInput, setAmountInput] = useState(1);
    const [amount, setAmount] = useState(1);
    const [converted, setConverted] = useState("0.000000");
    const [rate, setRate] = useState("0.000000");
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EUR");
    const [currencies, setCurrencies] = useState([]);

    // Load currencies
    useEffect(() => {
        axios
            .get(`${API_BASE}/Currencies`)
            .then((res) => setCurrencies(res.data))
            .catch(console.error);
    }, []);

    // Update rate on currency change
    useEffect(() => {
        if (from && to) {
            axios
                .get(`${API_BASE}/GetRate`, { params: { from, to } })
                .then((res) => {
                    setRate(res.data.rate.toFixed(6));
                })
                .catch(() => setRate("0.000000"));
        }
    }, [from, to]);

    const handleConvert = () => {
        axios
            .post(`${API_BASE}/Convert`, {
                amount: amountInput,
                from,
                to,
            })
            .then((res) => {
                setConverted(res.data.converted.toFixed(6));
                setAmount(amountInput);
                setRate(res.data.rate.toFixed(6)); // optional
            })
            .catch(() => {
                alert("You must be logged in to convert.");
            });
    };

    return (
        <div className="min-h-screen bg-[#0a1c50] text-white font-sans">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 shadow-md">
                <h1 className="text-2xl font-bold text-white">xe</h1>
                <nav className="flex items-center gap-6 text-white text-sm">
                    <a href="#" className="hover:underline">Help</a>
                    <a href="#" className="hover:underline">Login</a>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">Register</button>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center px-4 py-20">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
                    {amount.toFixed(2)} {from} to {to} - Convert {from} to {to}
                </h2>
                <p className="text-sm text-gray-300 mb-8">Xe Currency Converter</p>

                {/* Converter Box */}
                <div className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-5xl min-h-[270px] flex flex-col justify-between">
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-8">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Amount</label>
                                <input
                                    type="number"
                                    value={amountInput}
                                    onChange={(e) => setAmountInput(parseFloat(e.target.value) || 0)}
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>
                            <CurrencyDropdown value={from} onChange={setFrom} options={currencies} />
                            <CurrencyDropdown value={to} onChange={setTo} options={currencies} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
                        <div className="text-left text-lg font-semibold text-[#0a1c50]">
                            {amount.toFixed(2)} {from} = <span className="text-blue-600">{converted}</span> {to}
                            <p className="text-sm mt-1 text-gray-600">
                                1 {from} = {rate} {to}
                            </p>
                        </div>
                        <button
                            className="bg-blue-600 text-white font-medium px-6 py-3 min-w-[220px] rounded-full hover:bg-blue-700"
                            onClick={handleConvert}
                        >
                            Convert
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default HomePage;
