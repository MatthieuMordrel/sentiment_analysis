import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const FormField: React.FC<FormFieldProps> = ({ label, type, value, onChange, placeholder, options }) => {
  return (
    <div className='flex flex-col items-start'>
      <label className='mb-2 font-semibold' htmlFor={label}>
        {label}
      </label>
      {type === 'select' ? (
        <select id={label} value={value} onChange={onChange} className='w-full p-2 border border-gray-300 rounded text-black'>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={label}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='w-full p-2 border border-gray-300 rounded text-black'
        />
      )}
    </div>
  );
};

export default FormField;
