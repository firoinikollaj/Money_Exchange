import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender
} from "@tanstack/react-table";
import { Search, Plus } from "lucide-react";
import { showConfirmToast } from "../ConfirmToast";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ShowPasswordToast from "../ShowPasswordToast"; // path as needed


const API_BASE = "https://localhost:7121/api";

export default function Users() {


    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const navigate = useNavigate();

    const [pagination, setPagination] = useState(() => ({
        pageIndex: 0,
        pageSize: 10,
    }));

    const handleGeneratePassword = async (userId) => {
        try {
            const res = await axios.post(`${API_BASE}/Admin/GeneratePassword?userId=${userId}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            ShowPasswordToast(res.data); 
        } catch  {
            toast.error("Failed to generate password.");
        }
    };

    const handleDeleteUser = (id, email) => {
        showConfirmToast({
            message: `Are you sure you want to delete user "${email}"?`,
            onConfirm: () =>
                axios.delete(`https://localhost:7121/api/Admin/DeleteUser?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }),
            onsuccessClickMessage: "User deleted successfully!",
            onSuccessCallback: fetchUsers
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("https://localhost:7121/api/Admin/Users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((user) =>
            user.email.toLowerCase().includes(globalFilter.toLowerCase())
        );
    }, [data, globalFilter]);

    const columns = useMemo(() => [
        {
            header: "ID",
            accessorKey: "id",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Role",
            accessorKey: "role",
        },
        {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            navigate(`/admin/users/${row.original.id}`, {
                                state: {
                                    user: row.original,
                                },
                            });
                        }}
                        className="flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-sm transition"
                    >
                        ✏️ <span>Edit</span>
                    </button>
                    <button
                        onClick={() => handleDeleteUser(row.original.id, row.original.email)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition"
                    >
                        🗑️ <span>Delete</span>
                    </button>
                    <button
                        onClick={() => handleGeneratePassword(row.original.id)}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 rounded text-sm transition"
                    >
                        🔐 <span>Generate Password</span>
                    </button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border px-3 py-2 rounded w-full pl-10 text-sm"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>

                <button
                    onClick={() => navigate("/admin/users/new")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-sm"
                >
                    <Plus size={16} />
                    Add User
                </button>
            </div>

            <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 rounded">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 text-left text-sm text-gray-600"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-t hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-2 text-sm">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
                <div>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
               
            </div>
        </div>
    );
}
