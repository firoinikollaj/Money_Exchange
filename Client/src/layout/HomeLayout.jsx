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
            <header className="flex flex-col sm:flex-row justify-between sm:items-center px-6 py-4 shadow-md space-y-3 sm:space-y-0">
                {/* Logo */}
                <Link to="/" className="hover:underline">
                    <img src="/globex.png" alt="Globex Logo" className="h-16 w-24" />
                </Link>

                {/* Navigation */}
                <nav className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center sm:justify-end text-sm gap-2 sm:gap-6 text-right">
                    {email ? (
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center sm:gap-4 items-end sm:items-center text-right sm:text-left">
                            <span className="text-white font-medium break-all">
                                Welcome, <span className="text-blue-300">{email}</span>
                            </span>

                            {role === "Admin" && (
                                <Link
                                    to="/admin"
                                    className="bg-yellow-600 hover:bg-yellow-600 text-white px-4 py-1 rounded-full transition shadow-sm hover:shadow-md text-sm text-center whitespace-nowrap"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition shadow-sm hover:shadow-md text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-row flex-wrap justify-end items-center gap-2 sm:gap-4">
                            <Link to="/login" className="hover:underline whitespace-nowrap">Login</Link>
                            <Link to="/register">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded whitespace-nowrap">
                                    Register
                                </button>
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex flex-col items-center justify-center px-4 py-20">
                <Outlet />
            </main>
        </div>
    );
}
