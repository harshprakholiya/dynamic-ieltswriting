'use client';
import React from 'react';

type Props = {
  isEnabled: boolean;
  disabled: boolean;
  onToggle: () => void;
};

export default function SpellCheckToggle({ isEnabled, disabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg font-medium transition text-white ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : isEnabled
          ? 'bg-[#DA1F25] hover:bg-[#b61b1f]'
          : 'bg-[#000] hover:bg-[#222]'
      }`}
      disabled={disabled}
    >
      {isEnabled ? 'Spellcheck: ON' : 'Spellcheck: OFF'}
    </button>
  );
}