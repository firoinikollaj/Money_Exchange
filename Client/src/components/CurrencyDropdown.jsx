import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

export default function CurrencyDropdown({ value, onChange, options }) {
  const selectedOption = options.find((opt) => opt.code === value);

  return (
    <div>
      <label className="text-sm font-medium text-gray-600">Currency</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border text-sm shadow-md focus:outline-none">
            <span className="flex items-center gap-2">
              {selectedOption && (
                <img
                  src={getFlagUrl(selectedOption.countryCode)}
                  alt={selectedOption.code}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              {value}
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
              {options.map((opt) => (
                <Listbox.Option
                  key={opt.code}
                  value={opt.code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <img
                        src={getFlagUrl(opt.countryCode)}
                        alt={opt.code}
                        className="absolute left-2 w-6 h-6 rounded-full object-cover"
                      />
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
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
