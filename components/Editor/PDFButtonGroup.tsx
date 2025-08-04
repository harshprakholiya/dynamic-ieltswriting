'use client';
import React from 'react';

type Props = {
  onDownload: () => void;
  onClearText: () => void;
  onClearAll: () => void;
};

export default function PDFButtonGroup({ onDownload, onClearText, onClearAll }: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={onDownload}
        className="bg-[#DA1F25] hover:bg-[#b61b1f] text-white px-6 py-2 rounded-md font-medium transition"
      >
        Download PDF
      </button>
      <button
        onClick={onClearText}
        className="bg-[#FCCD06] hover:bg-[#e6b800] text-black px-6 py-2 rounded-md font-medium transition"
      >
        Clear Text Only
      </button>
      <button
        onClick={onClearAll}
        className="bg-[#000] hover:bg-[#222] text-white px-6 py-2 rounded-md font-medium transition"
      >
        Clear All
      </button>
    </div>
  );
}
