import React from "react";

interface FormInputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errrors: string[];
}
export default function FormInput({
  type,
  placeholder,
  required,
  errrors,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        type={type}
        placeholder={placeholder}
        required={required}
      />
      {errrors.map((error, idx) => (
        <span key={idx} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
