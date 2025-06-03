import { useState, useEffect } from "react";
import CurrencyDropdown from "./CurrencyDropdown";

function HomePage() {
  const [amountInput, setAmountInput] = useState(1);
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState("0.000000");
  const [liveRate, setLiveRate] = useState("0.000000");

  const [fromCurrency, setFromCurrency] = useState({
    code: "USD",
    country: "us",
  });
  const [toCurrency, setToCurrency] = useState({ code: "EUR", country: "eu" });

  const conversionRates = {
    USD: { EUR: 0.87, GBP: 0.76, JPY: 156.48 },
    EUR: { USD: 1.15, GBP: 0.87, JPY: 180.15 },
    GBP: { USD: 1.3, EUR: 1.14, JPY: 205.22 },
    JPY: { USD: 0.0064, EUR: 0.0056, GBP: 0.0049 },
  };

  // Update live rate display whenever currencies change
  useEffect(() => {
    const from = fromCurrency.code;
    const to = toCurrency.code;

    if (from === to) {
      setLiveRate("1.000000");
    } else {
      const rate = conversionRates[from]?.[to];
      setLiveRate(rate ? rate.toFixed(6) : "N/A");
    }
  }, [fromCurrency, toCurrency]);

  const handleConvert = () => {
    const from = fromCurrency.code;
    const to = toCurrency.code;

    if (from === to) {
      setConverted(amountInput.toFixed(6));
      setAmount(amountInput);
      return;
    }

    const rate = conversionRates[from]?.[to];
    if (!rate) {
      alert("Conversion rate not available.");
      return;
    }

    const result = (amountInput * rate).toFixed(6);
    setAmount(amountInput);
    setConverted(result);
  };

  return (
    <div className="min-h-screen bg-[#0a1c50] text-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold text-white">xe</h1>
        <nav className="flex items-center gap-4 sm:gap-6 text-white text-sm">
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Login
          </a>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm sm:text-base">
            Register
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        <h2 className="text-xl sm:text-3xl font-semibold mb-2 text-center">
          {amount.toFixed(2)} {fromCurrency.code} to {toCurrency.code} - Convert{" "}
          {fromCurrency.code} to {toCurrency.code}
        </h2>
        <p className="text-sm text-gray-300 mb-8">Xe Currency Converter</p>

        {/* Converter Box */}
        <div className="bg-white text-black rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-5xl min-h-[320px] flex flex-col justify-between">
          <div>
            {/* Mode Toggle */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
              <button className="bg-[#0a1c50] text-white px-4 py-2 rounded-full font-semibold text-sm sm:text-base">
                💱 Convert
              </button>
              <button className="text-gray-500 px-4 py-2 font-semibold rounded-full hover:bg-gray-100 text-sm sm:text-base">
                📤 Send
              </button>
              <button className="text-gray-500 px-4 py-2 font-semibold rounded-full hover:bg-gray-100 text-sm sm:text-base">
                📈 Charts
              </button>
              <button className="text-gray-500 px-4 py-2 font-semibold rounded-full hover:bg-gray-100 text-sm sm:text-base">
                🔔 Alerts
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-8">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Amount
                </label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) =>
                    setAmountInput(parseFloat(e.target.value) || 0)
                  }
                  className="w-full border p-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  From
                </label>
                <CurrencyDropdown
                  selected={fromCurrency}
                  setSelected={setFromCurrency}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">To</label>
                <CurrencyDropdown
                  selected={toCurrency}
                  setSelected={setToCurrency}
                />
              </div>
            </div>
          </div>

          {/* Result + Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
            <div className="text-base sm:text-lg font-semibold text-[#0a1c50]">
              {amount.toFixed(2)} {fromCurrency.code} ={" "}
              <span className="text-blue-600">{converted}</span>{" "}
              {toCurrency.code}
              <p className="text-sm mt-1 text-gray-600">
                1 {fromCurrency.code} = {liveRate} {toCurrency.code}
              </p>
            </div>

            <button
              onClick={handleConvert}
              className="bg-blue-600 text-white font-medium px-8 py-3 w-full sm:w-auto min-w-[200px] rounded-full hover:bg-blue-700 text-center"
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
