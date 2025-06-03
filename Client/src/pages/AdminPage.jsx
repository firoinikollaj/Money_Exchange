import { useEffect, useState } from "react";
import AdminPanelTabs from "../components/admin/AdminPanelTabs";
import Currencies from "../components/admin/Currencies";
import Users from "../components/admin/Users";

import { useLocation } from "react-router-dom";

export default function AdminPage() {

    const location = useLocation();
    const [activeTab, setActiveTab] = useState("currencies");

    useEffect(() => {
        if (location.state?.goToTab === "users") {
            setActiveTab("users");
        }
    }, [location.state]);

    return (
        <main className="flex flex-col items-center justify-center w-full px-4 py-10 sm:py-16">
            <h2 className="text-xl sm:text-3xl font-semibold mb-2 text-center">
                Admin Dashboard - {activeTab === "currencies" ? "Currencies" : "Users"}
            </h2>
            <p className="text-sm text-gray-300 mb-8 text-center">Manage GlobeX System</p>

            <div className="bg-white text-black rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-5xl flex flex-col justify-between">
                <AdminPanelTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === "currencies" && (
                   <Currencies />
                )}

                {activeTab === "users" && (
                   <Users />
                )}
            </div>
        </main>
    );
}
