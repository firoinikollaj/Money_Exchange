import { toast } from "react-hot-toast";

export const showConfirmToast = ({
    message,
    onConfirm,
    onsuccessClickMessage,
    onSuccessCallback, // optional
}) => {
    toast((t) => (
        <div className="p-2">
            <p className="text-sm font-medium mb-2">{message}</p>
            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1 text-sm border rounded text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    onClick={async () => {
                        try {
                            await onConfirm();
                            toast.dismiss(t.id);
                            toast.success(onsuccessClickMessage);

                            if (onSuccessCallback) {
                                onSuccessCallback();
                            }
                        } catch {
                            toast.dismiss(t.id);
                            toast.error("Error happened!");
                        }
                    }}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Confirm
                </button>
            </div>
        </div>
    ), { duration: 10000 });
};
