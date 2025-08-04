import React from 'react';

export default function LoadingFallback({ height = 100 }: { height?: number }) {
  return (
    <div
      className="bg-gray-200 animate-pulse rounded-md w-full"
      style={{ height }}
    ></div>
  );
}