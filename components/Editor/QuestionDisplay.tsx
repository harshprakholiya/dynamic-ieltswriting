'use client';
import React from 'react';

type Props = {
  question: string;
};

export default function QuestionDisplay({ question }: Props) {
  return (
    <div className="mb-6">
      <label className="block text-[#000] font-medium mb-2">Task Question</label>
      <div className="p-4 border border-[#d4d4d4] bg-gray-50 rounded text-[#000] font-medium">
        {question}
      </div>
    </div>
  );
}
