"use client";
import React, { useRef, useState } from "react";

export default function ResizableSplit({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(50); // initial width in %

  const isDragging = useRef(false);

  const onMouseDown = () => {
    isDragging.current = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const newLeftWidth = (e.clientX / containerWidth) * 100;
    if (newLeftWidth > 10 && newLeftWidth < 90) {
      setLeftWidth(newLeftWidth);
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full h-screen relative overflow-hidden"
    >
      <div
        className="h-full overflow-auto border-r"
        style={{ width: `${leftWidth}%` }}
      >
        {left}
      </div>

      <div
        className="w-1 bg-gray-400 cursor-col-resize"
        onMouseDown={onMouseDown}
      />

      <div
        className="flex-1 h-full overflow-auto"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {right}
      </div>
    </div>
  );
}
