import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HomeLayout() {
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setEmail(localStorage.getItem("email"));
        setRole(localStorage.getItem("role"));
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        setEmail(null);
        setRole(null);
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#0a1c50] text-white font-sans">
            <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 shadow-lg bg-[#0a1c50] border-b border-blue-900">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                    <img src="/globex.png" alt="Globex Logo" className="h-14 w-28" />
                </Link>

                {/* Navigation */}
                <nav className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                    {email ? (
                        <>
                            <div className="text-sm text-white text-center sm:text-left">
                                <div className="text-xs sm:text-sm opacity-70">Logged in as</div>
                                <div className="font-semibold text-blue-200 break-all">{email}</div>
                            </div>

                            {role === "Admin" && (
                                <Link
                                    to="/admin"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-full shadow transition whitespace-nowrap text-sm"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-full shadow transition text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                                <div className="flex gap-2 sm:gap-3">
                                    <Link to="/login">
                                        <button className="px-8 py-2 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 border border-blue-500 rounded-full shadow transition duration-150">
                                            Login
                                        </button>
                                    </Link>

                                    <Link to="/register">
                                        <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow transition duration-150">
                                            Register
                                        </button>
                                    </Link>
                                </div>

                        </>
                    )}
                </nav>
            </header>

            <main className="flex flex-col items-center justify-center px-4 py-10 sm:py-20">
                <Outlet />
            </main>
        </div>
    );
}
