export default function TabHeader({ activeTab, setActiveTab }) {
    const tabClasses = (tab) =>
        `px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${activeTab === tab
            ? "bg-[#1e2b50] text-white shadow"
            : "text-gray-600 hover:text-black"
        }`;

    return (
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 border border-gray-200 p-2 rounded-full bg-white shadow-sm w-full sm:w-fit mx-auto">
            <button onClick={() => setActiveTab("convert")} className={tabClasses("convert")}>
                💱 Convert
            </button>
            <button disabled className="text-gray-400 cursor-not-allowed px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                ✈️ Send
            </button>
            <button onClick={() => setActiveTab("charts")} className={tabClasses("charts")}>
                📊 Charts
            </button>
            <button disabled className="text-gray-400 cursor-not-allowed px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                🔔 Alerts
            </button>
        </div>
    );
}
