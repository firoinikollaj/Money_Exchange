import { toast } from "react-hot-toast";

export default function ShowPasswordToast(password) {
    toast.custom((t) => (
        <div
            className={`max-w-md bg-white shadow-lg rounded-xl p-4 border-l-4 border-blue-500 ${t.visible ? "animate-enter" : "animate-leave"
                }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-700 mb-1">🔐 New Password</p>
                    <p className="text-base font-mono font-semibold text-blue-600 break-all">{password}</p>
                </div>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-gray-500 hover:text-gray-800 ml-4"
                >
                    ✖
                </button>
            </div>
        </div>
    ), { duration: Infinity });
}
