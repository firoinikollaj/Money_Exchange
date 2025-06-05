import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurrencyDropdown from "./CurrencyDropdown";
import ModeTabs from "./ModeTabs";
import ChartsDisplay from "./ChartsDisplay";
import { Repeat } from "lucide-react"; // Add at the top


const API_BASE = "https://localhost:7121/api/Exchange";

export default function Converter() {
    const [amountInput, setAmountInput] = useState(1);
    const [amount, setAmount] = useState(1);
    const [converted, setConverted] = useState(0);
    const [rate, setRate] = useState(0);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EUR");
    const [currencies, setCurrencies] = useState([]);
    const [activeTab, setActiveTab] = useState("convert");

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${API_BASE}/Currencies`)
            .then((res) => setCurrencies(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (from && to) {
            axios
                .get(`${API_BASE}/GetRate`, { params: { from, to } })
                .then((res) => {
                    setRate(res.data.rate);
                })
                .catch(() => setRate(0));
        }
    }, [from, to]);

    const handleConvert = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .post(
                `${API_BASE}/Convert`,
                { amount: amountInput, from, to },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                setConverted(res.data.converted);
                setAmount(amountInput);
                setRate(res.data.rate);
            })
            .catch(() => {
                navigate("/login");
            });
    };

    const formatValue = (val) =>
        Number(val).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
        });

    return (
        <main className="flex flex-col items-center justify-center w-full px-4 py-10 sm:py-16">
            <h2 className="text-xl sm:text-3xl font-semibold mb-2 text-center">
                {formatValue(amount)} {from} to {to} - Convert {from} to {to}
            </h2>
            <p className="text-sm text-gray-300 mb-8 text-center">GlobeX Currency Converter</p>

            <div className="bg-white text-black rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-5xl flex flex-col justify-between">
                <ModeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === "convert" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_auto_1fr] gap-y-4 gap-x-3 items-end mb-6 mt-6">
                            {/* Amount Input */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">Amount</label>
                                <input
                                    type="number"
                                    value={amountInput}
                                    onChange={(e) => setAmountInput(parseFloat(e.target.value) || 0)}
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>

                            {/* From Dropdown with inline Swap Button */}
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-gray-600">From</label>
                                    {/* Swap Button (only shown on small screens this way) */}
                                    <button
                                        onClick={() => {
                                            const temp = from;
                                            setFrom(to);
                                            setTo(temp);
                                        }}
                                        className="sm:hidden text-gray-600 hover:text-gray-800 p-1 rounded-full transition hover:scale-110"
                                        title="Swap currencies"
                                    >
                                        <Repeat size={18} strokeWidth={2} />
                                    </button>
                                </div>
                                <CurrencyDropdown value={from} onChange={setFrom} options={currencies} />
                            </div>

                            {/* Swap Button for desktop */}
                            <div className="hidden sm:flex justify-center">
                                <button
                                    onClick={() => {
                                        const temp = from;
                                        setFrom(to);
                                        setTo(temp);
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow transition hover:scale-105"
                                    title="Swap currencies"
                                >
                                    <Repeat size={20} strokeWidth={2} />
                                </button>
                            </div>

                            {/* To Dropdown */}
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-600">To</label>
                                <CurrencyDropdown value={to} onChange={setTo} options={currencies} />
                            </div>
                        </div>






                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 w-full">
                            <div className="text-left text-lg font-semibold text-[#0a1c50] w-full md:w-auto">
                                <p className="text-sm uppercase tracking-wide text-gray-500 mb-1">Conversion Result</p>
                                <div className="text-[#0a1c50]">
                                    {formatValue(amount)} {from} ={" "}
                                    <span className="text-blue-600">{formatValue(converted)}</span> {to}
                                </div>

                                <div className="mt-3">
                                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Exchange Rate</p>
                                    <p className="text-sm text-gray-600">
                                        1 {from} = {formatValue(rate)} {to}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="bg-blue-600 text-white font-medium px-6 py-3 min-w-[220px] rounded-full hover:bg-blue-700 mt-4 md:mt-0"
                                onClick={handleConvert}
                            >
                                Convert
                            </button>
                        </div>


                    </>
                )}

                {activeTab === "charts" && <ChartsDisplay />}
            </div>
        </main>
    );
}
