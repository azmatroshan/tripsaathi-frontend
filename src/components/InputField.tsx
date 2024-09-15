import React from 'react';
import InputFieldProps from '../interfaces/InputFieldProps';


export default function InputField({
    icon,
    label,
    name,
    type,
    value,
    placeholder,
    required = true,
    onChange,
    disabled = false,
}: InputFieldProps) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor={name}>
                {icon} {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 transition duration-150 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required={required}
                disabled={disabled}
            />
        </div>
    );
}


