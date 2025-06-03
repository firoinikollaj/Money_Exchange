import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Plus } from "lucide-react";


export default function Users() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        axios
            .get("https://localhost:7121/api/Admin/Users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => setData(res.data))
            .catch(console.error);
    }, []);

    const filteredData = useMemo(() => {
        return data.filter((user) =>
            user.email.toLowerCase().includes(globalFilter.toLowerCase())
        );
    }, [data, globalFilter]);

    const columns = useMemo(
        () => [
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
                    <button className="flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-sm transition">
                        ✏️ <span>Edit</span>
                    </button>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
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

                {/* Add Button */}
                <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-sm"
                >
                    <Plus size={16} />
                    Add User
                </button>

            </div>

            {/* Table */}
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

            {/* Pagination Controls */}
            <div className="flex justify-end mt-4 gap-2 text-sm">
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
    );
}
