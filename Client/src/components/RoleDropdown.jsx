// RoleDropdown.jsx
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ShieldCheck, User as UserIcon } from "lucide-react";

const roles = [
    { code: "Admin", icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> },
    { code: "User", icon: <UserIcon className="w-4 h-4 text-blue-600" /> },
];

export default function RoleDropdown({ value, onChange, disabled = false }) {
    const selectedOption = roles.find((opt) => opt.code === value);

    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">User Role</label>
            <Listbox value={value} onChange={onChange} disabled={disabled}>
                <div className="relative mt-1">
                    <Listbox.Button
                        className={`relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border text-sm shadow-md focus:outline-none ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "text-gray-800"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            {selectedOption?.icon}
                            <span>{selectedOption?.code}</span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                        </span>
                    </Listbox.Button>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {roles.map((opt) => (
                                <Listbox.Option
                                    key={opt.code}
                                    value={opt.code}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-800"
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className="absolute left-2 flex items-center">
                                                {opt.icon}
                                            </span>
                                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                                {opt.code}
                                            </span>
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
