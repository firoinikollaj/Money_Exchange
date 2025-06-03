import { BarChart2, Users } from "lucide-react";

export default function AdminPanelTabs({ activeTab, setActiveTab }) {
    const tabs = [
        { id: "currencies", label: "Currencies", icon: <BarChart2 size={16} /> },
        { id: "users", label: "Users", icon: <Users size={16} /> },
    ];

    return (
        <div className="flex gap-4 justify-center rounded-full border border-gray-200 p-1 bg-white shadow-sm max-w-fit mx-auto mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${activeTab === tab.id
                            ? "bg-[#1e2b50] text-white shadow"
                            : "text-gray-600 hover:text-black"
                        }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
