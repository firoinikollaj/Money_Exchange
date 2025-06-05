import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { showConfirmToast } from "../ConfirmToast";



export default function Currencies() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const [reloadCurrencies, setReloadCurrencies] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        fetchCurrencies();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: "code",
                header: "Code",
            },
            {
                accessorKey: "name",
                header: "Name",
            },
            {
                accessorKey: "symbol",
                header: "Symbol",
            },
            {
                accessorKey: "countryCode",
                header: "Country",
                cell: ({ row }) => (
                    <img
                        src={`https://flagcdn.com/w40/${row.original.countryCode.toLowerCase()}.png`}
                        alt={row.original.countryCode}
                        className="h-5 w-6 rounded"
                    />
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate(`/admin/currencies/${row.original.id}`)}
                                className="flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-sm transition"
                            >
                                ✏️ <span>Edit</span>
                            </button>
                            <button
                                onClick={() => handleDeleteCurrency(row.original.id, row.original.code)}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition"
                            >
                                🗑️ <span>Delete</span>
                            </button>
                        </div>
                    </>
                ),
            }
,
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleDeleteCurrency = (id, code) => {
        showConfirmToast({
            message: `Are you sure you want to delete currency "${code}"?`,
            onConfirm: () =>
                axios.delete(`https://localhost:7121/api/Admin/DeleteCurrency?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }),
            onsuccessClickMessage: "Currency deleted successfully!",
            onSuccessCallback: fetchCurrencies
        });
    };

    const fetchCurrencies = async () => {
        try {
            const res = await axios.get("https://localhost:7121/api/Exchange/Currencies");
            setData(res.data);
        } catch (err) {
            toast.error("Failed to fetch currencies", err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                {/* Search Input */}
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
                    onClick={() => navigate("/admin/currencies/new")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-sm"
                >
                    <Plus size={16} />
                    Add Currency
                </button>
                
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded text-sm">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-4 py-2 text-left text-gray-600">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-t">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-2">
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
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
