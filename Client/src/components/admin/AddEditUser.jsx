import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import RoleDropdown from "../RoleDropdown";
import { Eye, EyeOff } from "lucide-react";

const API_BASE = "https://localhost:7121/api";

export default function AddEditUser() {
    const { userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(true);
    const [emailExists, setEmailExists] = useState(false);
    const [debouncedEmail] = useDebounce(email, 500);

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [role, setRole] = useState("User");
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleBackToUsers = () => {

        navigate("/admin", { state: { goToTab: "users" } });
    };

    useEffect(() => {
        if (!isEditMode && debouncedEmail) {
            const isValidFormat = /^\S+@\S+\.\S+$/.test(debouncedEmail);
            setEmailValid(isValidFormat);

            if (isValidFormat) {
                axios
                    .get(`${API_BASE}/Admin/CheckEmailExists?email=${encodeURIComponent(debouncedEmail)}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    .then((res) => setEmailExists(res.data.exists))
                    .catch(() => setEmailExists(false));
            } else {
                setEmailExists(false);
            }
        }
    }, [debouncedEmail, isEditMode]);

    useEffect(() => {
        if (!userId) {
            setIsEditMode(false);
            setLoading(false);
        } else {
            setIsEditMode(true);
            const passedUser = location.state?.user;

            if (passedUser) {
                setEmail(passedUser.email);
                setRole(passedUser.role);
                setLoading(false);
            } else {
                axios
                    .get(`${API_BASE}/Admin/GetUserById/${userId}`)
                    .then((res) => {
                        setEmail(res.data.email);
                        setRole(res.data.role);
                    })
                    .catch(() => toast.error("Failed to load user"))
                    .finally(() => setLoading(false));
            }
        }
    }, [userId, location.state]);

    const handleSubmit = async () => {
        if (!email || !role || (!isEditMode && !password)) {
            toast.error("All fields are required.");
            return;
        }

        if (!isEditMode && (!emailValid || emailExists)) {
            toast.error("Invalid or taken email.");
            return;
        }

        const payload = {
            email,
            password,
            role,
        };

        const endpoint = `${API_BASE}/Admin/AddEditUser?userId=${userId || 0}`;

        try {
            const res = await axios.post(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            toast.success(res.data); // Show success message from backend
            handleBackToUsers();
        } catch (err) {
            const errorMessage = err.response?.data || "Error saving user.";
            toast.error(errorMessage);
        }
    };


    const handleRegeneratePassword = async () => {
        try {
            await axios.post(`${API_BASE}/Admin/RegeneratePassword/${userId}`);
            toast.success("Password regenerated and emailed.");
        } catch {
            toast.error("Failed to regenerate password.");
        }
    };

    if (loading) return <div className="text-center mt-8 text-gray-500">Loading...</div>;

    const isEmailInputInvalid = !isEditMode && (!emailValid || emailExists);
    const canSubmit = isEditMode || (email && password && !isEmailInputInvalid);

    return (
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-[#0a1c50] mb-4">
                {isEditMode ? "Edit User" : "Add User"}
            </h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    disabled={isEditMode}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded text-sm text-black bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 ${isEmailInputInvalid
                        ? "border border-red-500 focus:ring-red-300"
                        : "border border-gray-300 focus:ring-blue-300"
                        }`}
                />
                {!isEditMode && (
                    <p className="text-sm mt-1 text-red-500">
                        {!emailValid
                            ? "Please enter a valid email address."
                            : emailExists
                                ? "This email is already registered."
                                : ""}
                    </p>
                )}
            </div>


            <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-[36px] right-3 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>


            <div className="mb-6">
                <RoleDropdown
                    value={role}
                    onChange={setRole}
                    disabled={false}
                />
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={handleBackToUsers}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all"
                >
                    ← Back to Users
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${canSubmit
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white focus:ring-blue-500"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {isEditMode ? "💾 Update User" : "➕ Add User"}
                </button>
            </div>
        </div>
    );
}
