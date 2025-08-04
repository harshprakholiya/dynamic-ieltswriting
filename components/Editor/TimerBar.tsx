'use client';
import React from 'react';

type Props = {
  difficulty: string;
  timeLeft: number;
  maxTime: number;
};

export default function TimerBar({ difficulty, timeLeft, maxTime }: Props) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const color =
    difficulty === 'Practice'
      ? '#16a34a'
      : `hsl(${(timeLeft / maxTime) * 120}, 100%, 40%)`;

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white z-20 py-4 border-t border-[#d4d4d4] shadow-sm">
      <p className="text-lg text-center font-semibold" style={{ color }}>
        Time Left: {difficulty === 'Practice' ? '∞' : formatTime(timeLeft)}
      </p>
    </div>
  );
}