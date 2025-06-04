import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CurrencyDropdown from "../CurrencyDropdown";
import { Link } from "react-router-dom"; 
import toast from 'react-hot-toast';


const API_BASE = "https://localhost:7121/api";

export default function AddEditCurrency() {
    const { currencyId } = useParams();
    const navigate = useNavigate();

    
    const [allCurrencies, setAllCurrencies] = useState([]);
    const [existingCurrencies, setExistingCurrencies] = useState([]);
    const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
    const [conversionRates, setConversionRates] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);


    const handleBackToCurrencies = () => {
        navigate("/admin", { state: { goToTab: "currencies" } });
    };


    useEffect(() => {
        if (!isEditMode && selectedCurrencyCode) {
            const fromCurrency = allCurrencies.find(a => a.code === selectedCurrencyCode);

            const newPairs = existingCurrencies.flatMap((c) => [
                {
                    from: selectedCurrencyCode,
                    to: c.code,
                    fromCountry: fromCurrency?.countryCode,
                    toCountry: c.countryCode,
                    rate: ""
                },
                {
                    from: c.code,
                    to: selectedCurrencyCode,
                    fromCountry: c.countryCode,
                    toCountry: fromCurrency?.countryCode,
                    rate: ""
                }
            ]);
            setConversionRates(newPairs);
        }
    }, [selectedCurrencyCode, isEditMode, existingCurrencies, allCurrencies]);


    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem("token");

                const [allRes, existingRes] = await Promise.all([
                    axios.get(
                        `${API_BASE}/Admin/AllCurrencies${currencyId ? `?currencyId=${currencyId}` : ""}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ),
                    axios.get(`${API_BASE}/Exchange/Currencies`)
                ]);

                setAllCurrencies(allRes.data);
                setExistingCurrencies(existingRes.data);

                const isEdit = !!currencyId;
                setIsEditMode(isEdit);

                if (isEdit) {
                    const existingCurrency = existingRes.data.find(c => c.id === parseInt(currencyId));
                    if (!existingCurrency) return;

                    setSelectedCurrencyCode(existingCurrency.code);

                    const convRes = await axios.get(`${API_BASE}/Admin/ConversionsFor?currencyId=${currencyId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const existingRates = convRes.data;

                    // Build pairs for both directions (existing only)
                    const pairs = existingRes.data
                        .filter(c => c.code !== existingCurrency.code)
                        .flatMap(c => ([
                            {
                                from: existingCurrency.code,
                                to: c.code,
                                rate: existingRates.find(r => r.from === existingCurrency.code && r.to === c.code)?.rate || "",
                                fromCountry: existingRates.find(r => r.from === existingCurrency.code && r.to === c.code)?.fromCountry || "",
                                toCountry: existingRates.find(r => r.from === existingCurrency.code && r.to === c.code)?.toCountry || ""
                            },
                            {
                                from: c.code,
                                to: existingCurrency.code,
                                rate: existingRates.find(r => r.from === c.code && r.to === existingCurrency.code)?.rate || "",
                                fromCountry: existingRates.find(r => r.from === c.code && r.to === existingCurrency.code)?.fromCountry || "",
                                toCountry: existingRates.find(r => r.from === c.code && r.to === existingCurrency.code)?.toCountry || ""
                            }
                        ]));


                    setConversionRates(pairs);
                } else {
                    const available = allRes.data.filter(ac => !existingRes.data.some(ec => ec.code === ac.code));
                    if (available.length === 0) return;

                    const defaultCurrency = available[0];
                    setSelectedCurrencyCode(defaultCurrency.code);

                    const pairs = existingRes.data.flatMap(c => ([
                        { from: defaultCurrency.code, to: c.code, rate: "" },
                        { from: c.code, to: defaultCurrency.code, rate: "" }
                    ]));

                    setConversionRates(pairs);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [currencyId]);

    const handleRateChange = (index, value) => {
        const updated = [...conversionRates];
        updated[index].rate = value;
        setConversionRates(updated);
    };

    const handleSubmit = async () => {

        if (!selectedCurrencyCode) {
            toast.error("Currency selection missing");
            return;
        }
       
        const payload = {
            currency: allCurrencies.find(c => c.code === selectedCurrencyCode),
            conversions: conversionRates.filter(r => r.rate !== "")
        };

        const endpoint = `${API_BASE}/Admin/AddUpdateCurrency?currencyId=${currencyId || 0}`;
     

        if (!payload.currency) {
            toast.error("Currency data missing!");
            return;
        }
        try {
            await axios.post(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (currencyId != 0 && currencyId != null)
                toast.success("Currency updated successfully!");
            else
                toast.success("Currency added successfully!");
            handleBackToCurrencies();
        } catch (err) {
            console.error(err);
            toast.error("Error saving currency");
        }
    };

    if (loading) return <div className="text-center mt-8 text-gray-500">Loading...</div>;

    const availableDropdownOptions = isEditMode
        ? existingCurrencies.filter(c => c.code === selectedCurrencyCode)
        : allCurrencies.filter(ac => !existingCurrencies.some(ec => ec.code === ac.code));

    return (
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-[#0a1c50] mb-4">
                {isEditMode ? "Edit Currency" : "Add Currency"}
            </h2>

            <div className="mb-6">
                <CurrencyDropdown
                    value={selectedCurrencyCode}
                    onChange={setSelectedCurrencyCode}
                    options={availableDropdownOptions}
                    disabled={isEditMode}
                />
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mb-2">Conversion Rates</h3>

            <div className="space-y-3">
                {conversionRates.map((rate, idx) => (
                    
                    <div key={idx} className="flex items-center gap-3">
                        <div className="flex w-full items-center gap-3">
                            <span className="w-40 flex items-center gap-2 text-sm text-gray-700 font-medium">
                                <img
                                    src={`https://flagcdn.com/w40/${rate.fromCountry?.toLowerCase()}.png`}
                                    alt={rate.from}
                                    className="w-5 h-5 rounded-full"
                                />
                                {rate.from}
                                <span>→</span>
                                <img
                                    src={`https://flagcdn.com/w40/${rate.toCountry?.toLowerCase()}.png`}
                                    alt={rate.to}
                                    className="w-5 h-5 rounded-full"
                                />
                                {rate.to}
                            </span>

                            <input
                                type="number"
                                step="0.001"
                                value={rate.rate}
                                onChange={(e) => handleRateChange(idx, e.target.value)}
                                className="flex-1 border rounded px-3 py-1 text-sm text-black bg-white"
                                required
                            />
                        </div>



                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={handleBackToCurrencies}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all"
                >
                    ← Back to Currencies
                </button>

                <button
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isEditMode ? "💾 Update Currency" : "➕ Add Currency"}
                </button>
            </div>
        </div>
    );
}
