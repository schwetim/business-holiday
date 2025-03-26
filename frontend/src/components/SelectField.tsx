import React from 'react';

interface SelectFieldProps {
  id?: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
  error,
  placeholder
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
        aria-label={label}
      >
        <option value="">{placeholder || 'All'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
