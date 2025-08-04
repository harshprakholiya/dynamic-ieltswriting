"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  spellCheck: boolean;
};

export default function EssayTextarea({
  value,
  onChange,
  disabled,
  spellCheck,
}: Props) {
  return (
    <div className="mb-5">
      <label className="block text-[#000] font-medium mb-2">Your Essay</label>
      <textarea
        className="w-full h-80 p-4 border border-[#d4d4d4] rounded-md bg-gray-50 text-[#000] font-mono text-base resize-none focus:outline-gray-500"
        placeholder="Write your essay here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={spellCheck}
        disabled={disabled}
      />
    </div>
  );
}
