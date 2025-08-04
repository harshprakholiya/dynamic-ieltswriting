'use client';
import React from 'react';

type Props = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export default function PartSelector({ value, disabled, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label className="font-medium text-[#000]">Select Part:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="border border-[#d4d4d4] rounded-md px-4 py-2 bg-white text-[#000] focus:outline-gray-500"
      >
        <option value="PART 1">PART 1</option>
        <option value="PART 2">PART 2</option>
      </select>
    </div>
  );
}